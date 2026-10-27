#!/usr/bin/env python3
"""Deterministic validator for durable-state schema 2.

The validator intentionally checks repository-resident state and evidence
relationships only. It does not execute project commands or decide whether a
human judgment is correct.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import stat
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Sequence

SUPPORTED_SCHEMA_VERSION = "2"

# A milestone may have a stable uppercase suffix, e.g. M14A.
# Use one grammar for headers, task IDs, references and request headings.
MILESTONE_PATTERN = r"M\d+[A-Z]*"
REQUEST_PATTERN = rf"{MILESTONE_PATTERN}-R\d+"
MILESTONE_RE = re.compile(rf"^{MILESTONE_PATTERN}$")
REQUEST_RE = re.compile(rf"^({REQUEST_PATTERN})$")
TASK_ID_PATTERN = rf"{REQUEST_PATTERN}(?:-F\d+)?-(?:(?:P|D|V|H)\d+|\d+(?:-\d+)*)"
TASK_ID_RE = re.compile(rf"^{TASK_ID_PATTERN}$")
TASK_REF_RE = re.compile(rf"\b({TASK_ID_PATTERN})\b")
REQUEST_HEADING_RE = re.compile(rf"^##\s+({REQUEST_PATTERN})\s+(?:—|-)\s+(.+?)\s*$")
FOLLOWUP_HEADING_RE = re.compile(rf"^###\s+({REQUEST_PATTERN}-F\d+)\s+(.+?)\s*$")
TASK_LINE_RE = re.compile(
    rf"^\s*-\s+\[([ ~?Hx-])\]\s+({TASK_ID_PATTERN})(?:\s+(.*?))?\s*$"
)
FIELD_RE = re.compile(r"^\s*(?:-\s+)?([A-Za-z][A-Za-z0-9-]*):\s*(.*?)\s*$")
LIST_ITEM_RE = re.compile(r"^\s*-\s+(.+?)\s*$")
HEADER_FIELD_RE = re.compile(r"^([A-Za-z][A-Za-z0-9-]*):\s*(.*?)\s*$")

ALLOWED_MILESTONE_STATES = {"NOT_STARTED", "ACTIVE", "BLOCKED", "COMPLETE"}
ALLOWED_PHASES = {
    "IMPLEMENTATION",
    "AUTOMATED_VERIFICATION",
    "HUMAN_VERIFICATION",
    "FOLLOW_UP",
}
ALLOWED_GATES = {
    "FUNCTIONAL",
    "CONSTRAINT",
    "INVARIANT",
    "INTEGRATION",
    "PRESENTATION",
    "HUMAN",
}
ALLOWED_ORACLES = {
    "independent-existing-regression",
    "property-or-invariant",
    "integration-or-end-to-end",
    "static-analysis",
    "same-change-generated-test",
    "external-reference-comparison",
    "human-observation",
}
ALLOWED_CONCLUSION_STATUSES = {
    "OBSERVED",
    "DERIVED",
    "VERIFIED",
    "HUMAN_ACCEPTED",
    "UNKNOWN",
}
REFERENCE_FIELDS = {
    "Requires",
    "Blocked-By",
    "Supersedes",
    "Superseded-By",
    "Verified-By",
    "Covers",
    "Conclusion-Evidence",
}
CONCLUSION_FIELDS = {
    "Conclusion",
    "Conclusion-Status",
    "Conclusion-Scope",
    "Conclusion-Evidence",
    "Conclusion-Limitations",
    "Conclusion-Recheck-On",
}
STRONG_NEGATIVE_RE = re.compile(
    r"\b(impossible|cannot|never|exhausted|no\s+solution|does\s+not\s+work|"
    r"cannot\s+originate|ruled\s+out)\b",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class FieldValue:
    value: str
    line: int


@dataclass
class Task:
    task_id: str
    marker: str
    title: str
    request: str
    line: int
    fields: dict[str, list[FieldValue]] = field(default_factory=dict)

    @property
    def kind(self) -> str:
        suffix = self.task_id.rsplit("-", 1)[-1]
        return suffix[0] if suffix[0] in "PDVH" else "R"

    def values(self, name: str) -> list[FieldValue]:
        return self.fields.get(name, [])

    def strings(self, name: str) -> list[str]:
        return [item.value for item in self.values(name)]

    def first(self, name: str) -> FieldValue | None:
        values = self.values(name)
        return values[0] if values else None


@dataclass(frozen=True)
class Diagnostic:
    severity: str
    code: str
    path: str
    line: int
    message: str

    def to_dict(self) -> dict[str, object]:
        return {
            "severity": self.severity,
            "code": self.code,
            "path": self.path,
            "line": self.line,
            "message": self.message,
        }


@dataclass
class ParsedLedger:
    path: Path
    header: dict[str, FieldValue]
    requests: dict[str, int]
    tasks: list[Task]


class Validator:
    def __init__(
        self,
        root: Path,
        *,
        strict: bool = False,
        target_schema: str | None = None,
    ) -> None:
        self.root = root.resolve()
        self.strict = strict
        self.target_schema = target_schema
        self.diagnostics: list[Diagnostic] = []
        self._git_head: str | None = None
        self._material_dirty: bool | None = None
        self._worktree_fingerprints: dict[str, str] = {}
        self._archive_cache: dict[str, str] = {}

    def add(
        self,
        severity: str,
        code: str,
        path: Path | str,
        line: int,
        message: str,
    ) -> None:
        try:
            display_path = str(Path(path).resolve().relative_to(self.root))
        except (ValueError, OSError):
            display_path = str(path)
        self.diagnostics.append(
            Diagnostic(severity=severity, code=code, path=display_path, line=line, message=message)
        )

    def error(self, code: str, path: Path | str, line: int, message: str) -> None:
        self.add("ERROR", code, path, line, message)

    def warning(self, code: str, path: Path | str, line: int, message: str) -> None:
        self.add("WARNING", code, path, line, message)

    def validate(self) -> list[Diagnostic]:
        self._validate_manifest_schema()

        status_path = self.root / "STATUS.md"
        tasks_path = self.root / "TASKS.md"
        status_header = self._parse_yaml_header(status_path)
        ledger = self._parse_tasks(tasks_path)

        if status_header is None or ledger is None:
            return self._sorted_diagnostics()

        self._validate_headers(status_path, status_header, ledger)
        task_by_id = self._validate_task_identity(ledger)
        self._validate_references(ledger, task_by_id)
        self._validate_evidence_coverage(ledger, task_by_id)
        self._validate_verification_tasks(ledger, task_by_id, status_header)
        self._validate_conclusions(ledger, task_by_id)
        self._validate_supersession(ledger, task_by_id)
        self._validate_file_bindings(ledger)
        self._validate_completion(ledger)

        return self._sorted_diagnostics()

    def _sorted_diagnostics(self) -> list[Diagnostic]:
        return sorted(
            self.diagnostics,
            key=lambda item: (item.path, item.line, item.severity, item.code, item.message),
        )

    def failed(self) -> bool:
        if any(item.severity == "ERROR" for item in self.diagnostics):
            return True
        return self.strict and any(item.severity == "WARNING" for item in self.diagnostics)

    def _validate_manifest_schema(self) -> None:
        for key in ("Milestone", "State", "Phase", "Active-Request"):
            elif task.values("Verified-By"):
                            ledger, task, "Result", "E088"
    def _validate_completion(self, ledger: ParsedLedger) -> None:
    raise SystemExit(main())

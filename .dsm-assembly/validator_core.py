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
        manifest = self.root / ".durable-state" / "MANIFEST"
        expected = self.target_schema or SUPPORTED_SCHEMA_VERSION
        if not manifest.exists():
            return
        values: dict[str, tuple[str, int]] = {}
        try:
            lines = manifest.read_text(encoding="utf-8").splitlines()
        except OSError as exc:
            self.error("E001", manifest, 1, f"cannot read manifest: {exc}")
            return
        for line_number, raw in enumerate(lines, start=1):
            if not raw or raw.lstrip().startswith("#") or "=" not in raw:
                continue
            key, value = raw.split("=", 1)
            key = key.strip()
            value = value.strip()
            if key in values:
                self.error("E002", manifest, line_number, f"duplicate manifest field {key}")
            values[key] = (value, line_number)
        schema = values.get("SCHEMA_VERSION")
        if schema is None:
            self.error("E003", manifest, 1, "manifest is missing SCHEMA_VERSION")
        elif schema[0] != expected and self.target_schema is None:
            self.error(
                "E004",
                manifest,
                schema[1],
                f"installed schema {schema[0]} is incompatible with validator schema {expected}",
            )

    def _parse_yaml_header(self, path: Path) -> dict[str, FieldValue] | None:
        if not path.is_file():
            self.error("E010", path, 1, "required file is missing")
            return None
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeError) as exc:
            self.error("E011", path, 1, f"cannot read UTF-8 file: {exc}")
            return None

        in_yaml = False
        found_yaml = False
        header: dict[str, FieldValue] = {}
        for line_number, raw in enumerate(lines, start=1):
            stripped = raw.strip()
            if not in_yaml:
                if stripped == "```yaml":
                    in_yaml = True
                    found_yaml = True
                continue
            if stripped == "```":
                break
            match = HEADER_FIELD_RE.match(stripped)
            if not match:
                if stripped:
                    self.error("E012", path, line_number, "invalid YAML-header line")
                continue
            key, value = match.groups()
            if key in header:
                self.error("E013", path, line_number, f"duplicate header field {key}")
            header[key] = FieldValue(value=value, line=line_number)

        if not found_yaml:
            self.error("E014", path, 1, "missing leading ```yaml state header")
            return None
        return header

    def _parse_tasks(self, path: Path) -> ParsedLedger | None:
        header = self._parse_yaml_header(path)
        if header is None:
            return None
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeError) as exc:
            self.error("E015", path, 1, f"cannot read UTF-8 file: {exc}")
            return None

        requests: dict[str, int] = {}
        tasks: list[Task] = []
        current_request: str | None = None
        current_task: Task | None = None
        current_list_field: str | None = None
        in_inherited_section = False
        in_fence = False

        for line_number, raw in enumerate(lines, start=1):
            stripped = raw.strip()
            if stripped.startswith("```"):
                in_fence = not in_fence
                continue
            if in_fence:
                continue

            request_match = REQUEST_HEADING_RE.match(raw) or FOLLOWUP_HEADING_RE.match(raw)
            if request_match:
                current_request = request_match.group(1)
                in_inherited_section = False
                if current_request in requests:
                    self.error(
                        "E020", path, line_number, f"duplicate request heading {current_request}"
                    )
                requests[current_request] = line_number
                current_task = None
                current_list_field = None
                continue

            if raw.startswith("## "):
                in_inherited_section = raw.strip() == "## Inherited unresolved human gates"
                current_request = None
                current_task = None
                current_list_field = None
                continue

            task_match = TASK_LINE_RE.match(raw)
            if task_match:
                marker, task_id, title = task_match.groups()
                request = task_id.rsplit("-", 1)[0]
                current_task = Task(
                    task_id=task_id,
                    marker=marker,
                    title=(title or "").strip(),
                    request=request,
                    line=line_number,
                )
                tasks.append(current_task)
                current_list_field = None
                if current_request is None and not (in_inherited_section and current_task.kind == "H"):
                    self.error("E021", path, line_number, f"task {task_id} is outside a request group")
                elif current_request is not None and current_request != request and not (
                    current_request.startswith(request + "-F")
                ):
                    self.error(
                        "E022",
                        path,
                        line_number,
                        f"task {task_id} is under request {current_request}",
                    )
                continue

            if current_task is None:
                continue

            field_match = FIELD_RE.match(raw)
            if field_match:
                key, value = field_match.groups()
                current_list_field = key
                if value:
                    current_task.fields.setdefault(key, []).append(
                        FieldValue(value=value, line=line_number)
                    )
                else:
                    current_task.fields.setdefault(key, [])
                continue

            item_match = LIST_ITEM_RE.match(raw)
            if item_match and current_list_field:
                current_task.fields.setdefault(current_list_field, []).append(
                    FieldValue(value=item_match.group(1), line=line_number)
                )
                continue

            if stripped and not raw.startswith((" ", "\t")):
                current_task = None
                current_list_field = None

        return ParsedLedger(path=path, header=header, requests=requests, tasks=tasks)

    @staticmethod
    def _placeholder(value: str) -> bool:
        normalized = value.strip()
        return (
            not normalized
            or ("<" in normalized and ">" in normalized)
            or normalized.upper() in {"TBD", "TODO", "PLACEHOLDER"}
        )

    @staticmethod
    def _kind_from_id(task_id: str) -> str:
        suffix = task_id.rsplit("-", 1)[-1]
        return suffix[0] if suffix[0] in "PDVH" else "R"

    def _required_header(
        self, path: Path, header: dict[str, FieldValue], key: str
    ) -> FieldValue | None:
        item = header.get(key)
        if item is None:
            self.error("E030", path, 1, f"missing required header field {key}")
            return None
        if self._placeholder(item.value):
            self.error("E031", path, item.line, f"header field {key} is unresolved")
        return item

    def _validate_headers(
        self,
        status_path: Path,
        status: dict[str, FieldValue],
        ledger: ParsedLedger,
    ) -> None:
        tasks_path = ledger.path
        for key in ("Milestone", "State"):
            self._required_header(status_path, status, key)
            self._required_header(tasks_path, ledger.header, key)

        milestone = status.get("Milestone")
        state = status.get("State")
        if milestone and not MILESTONE_RE.fullmatch(milestone.value):
            self.error("E032", status_path, milestone.line, "Milestone must match M<number><optional uppercase suffix>")
        if state and state.value not in ALLOWED_MILESTONE_STATES:
            self.error(
                "E033",
                status_path,
                state.line,
                f"invalid milestone State {state.value!r}",
            )

        for key in ("Milestone", "State", "Phase", "Active-Request"):
            elif task.values("Verified-By"):
                            ledger, task, "Result", "E088"
    def _validate_completion(self, ledger: ParsedLedger) -> None:
    raise SystemExit(main())

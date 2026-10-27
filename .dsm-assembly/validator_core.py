#!/usr/bin/env python3
    def _validate_manifest_schema(self) -> None:
        for key in ("Milestone", "State", "Phase", "Active-Request"):
            elif task.values("Verified-By"):
                            ledger, task, "Result", "E088"
                        )
                        self._require_task_field(ledger, task, "Limitations", "E096")
                        if result_values and not result_values[0].value.upper().startswith("PASS"):
                            self.error(
                                "E090", ledger.path, result_values[0].line,
                                f"{task.task_id} historical result must begin PASS",
                            )
                    else:
                        if mode is not None:
                            self.error(
                                "E099", ledger.path, mode.line,
                                f"unsupported Evidence-Mode {mode.value!r}",
                            )
                        self._require_task_field(ledger, task, "Command", "E085")
                        self._require_task_field(ledger, task, "Oracle", "E086")
                        self._require_task_field(ledger, task, "Expected", "E087")
                        result_values = self._require_task_field(ledger, task, "Result", "E088")
                        repository_values = self._require_task_field(
                            ledger, task, "Repository-State", "E089"
                        )
                        self._require_task_field(ledger, task, "Limitations", "E096")
                        if result_values and not result_values[0].value.upper().startswith("PASS"):
                            self.error(
                                "E090", ledger.path, result_values[0].line,
                                f"verified V task {task.task_id} must record a PASS result",
                            )
                        if repository_values and task.task_id in current_evidence_ids:
                            self._validate_repository_state_value(
                                ledger.path, repository_values[0], task.task_id
                            )
                elif any(
                    item.value.upper().startswith("PASS") for item in task.values("Result")
                ):
                    self.warning(
                        "W080",
                        ledger.path,
                        task.values("Result")[0].line,
                        f"{task.task_id} records PASS but is not [x] VERIFIED",
                    )

            if task.kind == "H":
                if task.marker == "x":
                    decision_values = self._require_task_field(
                        ledger, task, "Human-Decision", "E091"
                    )
                    self._require_task_field(ledger, task, "Decision-Source", "E092")
                    if decision_values and decision_values[0].value != "ACCEPTED":
                        self.error(
                            "E093",
                            ledger.path,
                            decision_values[0].line,
                            "verified H task must record Human-Decision: ACCEPTED",
                        )
                elif any(item.value == "ACCEPTED" for item in task.values("Human-Decision")):
                    self.error(
                        "E094",
                        ledger.path,
                        task.values("Human-Decision")[0].line,
                        f"{task.task_id} records acceptance but is not [x] VERIFIED",
                    )

    def _validate_repository_state_value(
        self, path: Path, value: FieldValue, task_id: str
    ) -> None:
        text = value.value.strip()
        clean_match = re.fullmatch(
            r"HEAD=([0-9a-fA-F]{7,40});\s*WORKTREE=CLEAN", text
        )
        dirty_match = re.fullmatch(
            r"HEAD=([0-9a-fA-F]{7,40});\s*DIFF-SHA256=([0-9a-fA-F]{64})", text
        )
        if not clean_match and not dirty_match:
            self.error(
                "E095",
                path,
                value.line,
                f"{task_id} Repository-State must be HEAD=<sha>; WORKTREE=CLEAN or HEAD=<sha>; DIFF-SHA256=<sha256>",
            )
            return

        match = clean_match or dirty_match
        assert match is not None
        recorded_head = self.resolve_git_ref(match.group(1))
        if not recorded_head:
            self.warning(
                "W081",
                path,
                value.line,
                f"{task_id} evidence HEAD {match.group(1).lower()} is unavailable in this worktree",
            )
            return

        if clean_match:
            if self.material_changed_since(recorded_head):
                self.warning(
                    "W082",
                    path,
                    value.line,
                    f"{task_id} evidence is stale: material files changed after recorded clean state {recorded_head}",
                )
            return

        assert dirty_match is not None
        current_diff = self.worktree_fingerprint(recorded_head)
        recorded_diff = dirty_match.group(2).lower()
        if current_diff and current_diff != recorded_diff:
            self.warning(
                "W083",
                path,
                value.line,
                f"{task_id} material-worktree fingerprint is stale",
            )

    def _validate_conclusions(self, ledger: ParsedLedger, task_by_id: dict[str, Task]) -> None:
        for task in ledger.tasks:
            has_conclusion = any(task.values(name) for name in CONCLUSION_FIELDS)
            if not has_conclusion:
                continue
            if task.kind != "D":
                self.error(
                    "E100",
                    ledger.path,
                    task.line,
                    f"decision-shaping conclusions belong on D tasks, not {task.kind} tasks",
                )
            for name in CONCLUSION_FIELDS:
                self._require_task_field(ledger, task, name, "E101")

            status_item = task.first("Conclusion-Status")
            if status_item and status_item.value not in ALLOWED_CONCLUSION_STATUSES:
                self.error(
                    "E102",
                    ledger.path,
                    status_item.line,
                    f"invalid Conclusion-Status {status_item.value!r}",
                )
                continue

            statement = task.first("Conclusion")
            if (
                statement
                and status_item
                and status_item.value not in {"VERIFIED", "HUMAN_ACCEPTED"}
                and STRONG_NEGATIVE_RE.search(statement.value)
            ):
                self.warning(
                    "W100",
                    ledger.path,
                    statement.line,
                    "strong negative conclusion is not independently verified; bound it to the observed scope",
                )

            evidence_refs = self._refs(task.values("Conclusion-Evidence"))
            if not status_item:
                continue
            if status_item.value == "VERIFIED":
                resolved = [task_by_id[ref] for ref, _ in evidence_refs if ref in task_by_id]
                if not any(item.kind in {"V", "H"} and item.marker == "x" for item in resolved):
                    self.error(
                        "E103",
                        ledger.path,
                        status_item.line,
                        "VERIFIED conclusion requires at least one verified V/H task in Conclusion-Evidence",
                    )
            elif status_item.value == "HUMAN_ACCEPTED":
                resolved = [task_by_id[ref] for ref, _ in evidence_refs if ref in task_by_id]
                if not any(item.kind == "H" and item.marker == "x" for item in resolved):
                    self.error(
                        "E104",
                        ledger.path,
                        status_item.line,
                        "HUMAN_ACCEPTED conclusion requires a verified H task in Conclusion-Evidence",
                    )

    def _validate_supersession(self, ledger: ParsedLedger, task_by_id: dict[str, Task]) -> None:
        for task in ledger.tasks:
            supersedes = {ref for ref, _ in self._refs(task.values("Supersedes"))}
            superseded_by = {ref for ref, _ in self._refs(task.values("Superseded-By"))}
            for old_id in supersedes:
                old = task_by_id.get(old_id)
                if old is None:
                    continue
                reverse = {ref for ref, _ in self._refs(old.values("Superseded-By"))}
                if task.task_id not in reverse:
                    self.error(
                        "E110",
                        ledger.path,
                        task.line,
                        f"{task.task_id} supersedes {old_id}, but the reverse Superseded-By link is missing",
                    )
            for new_id in superseded_by:
                new = task_by_id.get(new_id)
                if new is None:
                    continue
                reverse = {ref for ref, _ in self._refs(new.values("Supersedes"))}
                if task.task_id not in reverse:
                    self.error(
                        "E111",
                        ledger.path,
                        task.line,
                        f"{task.task_id} is superseded by {new_id}, but the reverse Supersedes link is missing",
                    )
            if task.marker == "-" and not superseded_by:
                self.error(
                    "E112",
                    ledger.path,
                    task.line,
                    f"superseded task {task.task_id} lacks a task-ID Superseded-By link",
                )

    def _validate_file_bindings(self, ledger: ParsedLedger) -> None:
        for task in ledger.tasks:
            for item in task.values("Doc"):
                value = item.value.split("#", 1)[0].strip()
                if self._placeholder(value):
                    continue
                if value.startswith("docs/") and not (self.root / value).exists():
                    self.error(
                        "E120",
                        ledger.path,
                        item.line,
                        f"{task.task_id} references missing canonical document {value}",
                    )
            if task.marker != "x":
                continue
            for item in task.values("Implementation"):
                value = item.value.strip()
                if self._placeholder(value):
                    continue
                path_part = re.split(r"::|#", value, maxsplit=1)[0]
                if "/" in path_part and not (self.root / path_part).exists():
                    self.error(
                        "E121",
                        ledger.path,
                        item.line,
                        f"{task.task_id} references missing implementation path {path_part}",
                    )

    def _validate_completion(self, ledger: ParsedLedger) -> None:
    raise SystemExit(main())

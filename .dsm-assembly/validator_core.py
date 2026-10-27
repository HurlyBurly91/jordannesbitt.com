#!/usr/bin/env python3
    def _validate_manifest_schema(self) -> None:
        for key in ("Milestone", "State", "Phase", "Active-Request"):
            left = status.get(key)
            right = ledger.header.get(key)
            if (left is None) != (right is None):
                path = status_path if left is None else tasks_path
                line = 1 if left is None and right is None else (right.line if left is None else left.line)
                self.error("E034", path, line, f"{key} must appear in both STATUS.md and TASKS.md")
            elif left and right and left.value != right.value:
                self.error(
                    "E035",
                    tasks_path,
                    right.line,
                    f"{key}={right.value!r} disagrees with STATUS.md value {left.value!r}",
                )

        state_value = state.value if state else None
        phase = status.get("Phase")
        active_request = status.get("Active-Request")
        if state_value in {"ACTIVE", "BLOCKED"}:
            if phase is None:
                self.error("E036", status_path, 1, f"{state_value} state requires Phase")
            elif phase.value not in ALLOWED_PHASES:
                self.error("E037", status_path, phase.line, f"invalid Phase {phase.value!r}")
            if active_request is None:
                self.error("E038", status_path, 1, f"{state_value} state requires Active-Request")
            elif not REQUEST_RE.fullmatch(active_request.value):
                self.error(
                    "E039",
                    status_path,
                    active_request.line,
                    "Active-Request must match M<number><optional uppercase suffix>-R<number>",
                )
            elif active_request.value not in ledger.requests:
                self.error(
                    "E040",
                    status_path,
                    active_request.line,
                    f"Active-Request {active_request.value} has no request heading in TASKS.md",
                )
        elif state_value in {"NOT_STARTED", "COMPLETE"}:
            if phase is not None:
                self.warning(
                    "W030",
                    status_path,
                    phase.line,
                    f"{state_value} state normally omits Phase",
                )
            if active_request is not None:
                self.warning(
                    "W031",
                    status_path,
                    active_request.line,
                    f"{state_value} state normally omits Active-Request",
                )

        if milestone and active_request and not active_request.value.startswith(milestone.value + "-"):
            self.error(
                "E041",
                status_path,
                active_request.line,
                f"Active-Request {active_request.value} does not belong to {milestone.value}",
            )

        for key in ("Spec", "Ledger"):
            item = status.get(key)
            if not item or self._placeholder(item.value):
                continue
            target = self.root / item.value
            if not target.exists():
                self.error("E042", status_path, item.line, f"{key} target does not exist: {item.value}")

    def _validate_task_identity(self, ledger: ParsedLedger) -> dict[str, Task]:
        task_by_id: dict[str, Task] = {}
        milestone = ledger.header.get("Milestone")
        state = ledger.header.get("State")

        for request, line in ledger.requests.items():
            if milestone and not request.startswith(milestone.value + "-"):
                self.error(
                    "E050",
                    ledger.path,
                    line,
                    f"request {request} does not belong to active milestone {milestone.value}",
                )

        for task in ledger.tasks:
            if task.task_id in task_by_id:
                self.error(
                    "E051",
                    ledger.path,
                    task.line,
                    f"duplicate task ID {task.task_id}; first defined on line {task_by_id[task.task_id].line}",
                )
            else:
                task_by_id[task.task_id] = task

            if task.request not in ledger.requests and not (
                task.kind == "H" and task.values("Coverage-Source")
            ):
                self.error(
                    "E052", ledger.path, task.line, f"task {task.task_id} has no matching request heading"
                )
            if milestone and not task.task_id.startswith(milestone.value + "-"):
                self.error(
                    "E053",
                    ledger.path,
                    task.line,
                    f"task {task.task_id} does not belong to active milestone {milestone.value}",
                )
            if self._placeholder(task.title):
                self.error("E054", ledger.path, task.line, f"task {task.task_id} has no concrete title")
            if task.marker == "H" and task.kind != "H":
                self.error(
                    "E055",
                    ledger.path,
                    task.line,
                    "[H] AWAITING_HUMAN is valid only for H-namespace tasks",
                )
            if task.marker == "-" and not task.values("Superseded-By"):
                self.error(
                    "E056",
                    ledger.path,
                    task.line,
                    f"superseded task {task.task_id} requires Superseded-By",
                )
            if task.marker == "?" and not task.values("Blocked-By"):
                self.error(
                    "E057",
                    ledger.path,
                    task.line,
                    f"blocked task {task.task_id} requires Blocked-By",
                )

        if state and state.value == "NOT_STARTED" and ledger.tasks:
            self.error("E058", ledger.path, ledger.tasks[0].line, "NOT_STARTED ledger must not contain live tasks")
        if state and state.value == "BLOCKED" and not any(task.marker == "?" for task in ledger.tasks):
            self.error("E059", ledger.path, state.line, "BLOCKED milestone has no blocked task")

        return task_by_id

    def _refs(self, values: Iterable[FieldValue]) -> list[tuple[str, int]]:
        found: list[tuple[str, int]] = []
        for item in values:
            for match in TASK_REF_RE.finditer(item.value):
                found.append((match.group(1), item.line))
        return found

    def _archived_task_found(
        self, source: FieldValue | None, task_id: str, *, marker: str | None = None
    ) -> bool:
        """Check an exact task declaration in an existing local archive."""
        if source is None or not source.value.startswith("records/"):
            return False
        path = (self.root / source.value).resolve()
        try:
            path.relative_to((self.root / "records").resolve())
        except ValueError:
            return False
        if not path.is_file():
            return False
        key = str(path)
        if key not in self._archive_cache:
            try:
                self._archive_cache[key] = path.read_text(encoding="utf-8")
            except (OSError, UnicodeError):
                return False
        mark = re.escape(marker) if marker is not None else r"[ ~?Hx-]"
        pattern = rf"(?m)^\s*-\s*\[{mark}\]\s+{re.escape(task_id)}(?=\s|$)"
        return re.search(pattern, self._archive_cache[key]) is not None

    def _validate_references(self, ledger: ParsedLedger, task_by_id: dict[str, Task]) -> None:
        for task in ledger.tasks:
            for field_name in REFERENCE_FIELDS:
                for ref, line in self._refs(task.values(field_name)):
                    if ref not in task_by_id:
                        if field_name == "Covers" and task.kind == "H" and self._archived_task_found(
                            task.first("Coverage-Source"), ref
                        ):
                            continue
                        self.error(
                            "E060",
                            ledger.path,
                            line,
                            f"{task.task_id} {field_name} references unknown task {ref}",
                        )
                    if ref == task.task_id:
                        self.error(
                            "E061",
                            ledger.path,
                            line,
                            f"{task.task_id} may not reference itself through {field_name}",
                        )

    def _validate_evidence_coverage(
        self, ledger: ParsedLedger, task_by_id: dict[str, Task]
    ) -> None:
        for task in ledger.tasks:
            if task.kind in {"R", "P"}:
                verified_by = self._refs(task.values("Verified-By"))
                if task.marker == "x" and not verified_by:
                    self.error(
                        "E070",
                        ledger.path,
                        task.line,
                        f"verified requirement {task.task_id} requires Verified-By evidence",
                    )
                for target_id, line in verified_by:
                    target = task_by_id.get(target_id)
                    if target is None:
                        continue
                    if target.kind not in {"V", "H"}:
                        self.error(
                            "E071",
                            ledger.path,
                            line,
                            f"Verified-By target {target_id} is not a V/H evidence task",
                        )
                        continue
                    covers = {ref for ref, _ in self._refs(target.values("Covers"))}
                    if task.task_id not in covers:
                        self.error(
                            "E072",
                            ledger.path,
                            line,
                            f"{target_id} does not list {task.task_id} in Covers",
                        )
                    if task.marker == "x" and target.marker != "x":
                        self.error(
                            "E073",
                            ledger.path,
                            line,
                            f"verified requirement {task.task_id} depends on unresolved evidence {target_id}",
                        )
            elif task.values("Verified-By"):
                            ledger, task, "Result", "E088"
    def _validate_completion(self, ledger: ParsedLedger) -> None:
    raise SystemExit(main())

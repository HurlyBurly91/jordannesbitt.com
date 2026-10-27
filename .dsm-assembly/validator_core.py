#!/usr/bin/env python3
    def _validate_manifest_schema(self) -> None:
        for key in ("Milestone", "State", "Phase", "Active-Request"):
            elif task.values("Verified-By"):
                self.warning(
                    "W070",
                    ledger.path,
                    task.values("Verified-By")[0].line,
                    f"Verified-By is intended for R/P requirements, not {task.kind} tasks",
                )

            if task.kind == "H" and task.values("Coverage-Source"):
                archive = task.first("Coverage-Source")
                if not any(
                    ref not in task_by_id and self._archived_task_found(archive, ref)
                    for ref, _ in self._refs(task.values("Covers"))
                ):
                    self.error("E077", ledger.path, task.line,
                               f"{task.task_id} Coverage-Source requires an exact archived requirement")

            if task.kind in {"V", "H"}:
                covers = self._refs(task.values("Covers"))
                if not covers:
                    self.error(
                        "E074",
                        ledger.path,
                        task.line,
                        f"evidence task {task.task_id} requires Covers",
                    )
                for target_id, line in covers:
                    target = task_by_id.get(target_id)
                    if target is None:
                        continue
                    if target.kind not in {"R", "P"}:
                        self.error(
                            "E075",
                            ledger.path,
                            line,
                            f"Covers target {target_id} is not an R/P requirement",
                        )
                        continue
                    reverse = {ref for ref, _ in self._refs(target.values("Verified-By"))}
                    if task.task_id not in reverse:
                        self.error(
                            "E076",
                            ledger.path,
                            line,
                            f"{target_id} does not list {task.task_id} in Verified-By",
                        )
            elif task.values("Covers"):
                self.warning(
                    "W071",
                    ledger.path,
                    task.values("Covers")[0].line,
                    f"Covers is intended for V/H evidence tasks, not {task.kind} tasks",
                )

    def _require_task_field(
        self,
        ledger: ParsedLedger,
        task: Task,
        name: str,
        code: str,
    ) -> list[FieldValue]:
        values = task.values(name)
        if not values:
            self.error(code, ledger.path, task.line, f"{task.task_id} requires {name}")
            return []
        for item in values:
            if self._placeholder(item.value) or item.value.upper() == "UNKNOWN":
                self.error(code, ledger.path, item.line, f"{task.task_id} has unresolved {name}")
        return values

    @staticmethod
    def _human_gate_candidate(
        status: dict[str, FieldValue],
        ledger: ParsedLedger,
        task_by_id: dict[str, Task],
    ) -> Task | None:
        """Resolve the same pending gate for readiness and freshness checks.

        Readiness reports invalid or ambiguous selection separately. This
        helper only resolves a valid explicit selection or the sole pending
        human gate; it never silently substitutes for an invalid Next-Gate.
        """
        next_gate = status.get("Next-Gate")
        if next_gate is None:
            pending = [
                task for task in ledger.tasks
                if task.kind == "H" and task.marker == "H"
            ]
            return pending[0] if len(pending) == 1 else None
        candidate = task_by_id.get(next_gate.value)
        if candidate is not None and candidate.kind == "H" and candidate.marker == "H":
            return candidate
        return None

    def _current_evidence_ids(
        self,
        ledger: ParsedLedger,
        task_by_id: dict[str, Task],
        status_header: dict[str, FieldValue],
    ) -> set[str]:
        """Select evidence whose present-day applicability is explicitly claimed.

        Check V evidence explicitly referenced by unfinished non-human work,
        rather than every completed V task in the active request. Completed
        tasks are historical execution records, not continuously asserted
        current-candidate claims. Pending human gates are not implicitly
        selected. Dependencies on older requirements are *not* implicit
        requests to revalidate every test that established them:
        Requires/Blocked-By represent task ordering, not evidence reuse.
        A selected human gate (explicit or sole pending) contributes evidence
        only during HUMAN_VERIFICATION. Follow explicit Requires/Blocked-By
        dependencies, but never import an old requirement's Verified-By chain.
        Inconsistent active-request metadata retains conservative checking.
        """
        all_evidence = {task.task_id for task in ledger.tasks if task.kind == "V"}
        active = ledger.header.get("Active-Request")
        status_active = status_header.get("Active-Request")
        if (
            active is None
            or status_active is None
            or active.value != status_active.value
            or not REQUEST_RE.fullmatch(active.value)
        ):
            return all_evidence

        request_tasks = [
            task for task in ledger.tasks
            if task.request == active.value
            or task.request.startswith(active.value + "-F")
        ]
        if not request_tasks:
            return all_evidence

        # Completed work, including V records in this request, is historical
        # until unfinished work explicitly cites it as currently applicable.
        # A request containing only human tasks must not trigger the
        # missing-request conservative fallback.
        current_tasks = [
            task for task in request_tasks
            if task.kind != "H" and task.marker not in {"x", "-"}
        ]

        phase = status_header.get("Phase")
        selected = None
        if phase is not None and phase.value == "HUMAN_VERIFICATION":
            selected = self._human_gate_candidate(status_header, ledger, task_by_id)
            if selected is not None:
                current_tasks.append(selected)

        current_evidence = {task.task_id for task in current_tasks if task.kind == "V"}
        for task in current_tasks:
            for field_name in (
                "Requires", "Blocked-By", "Verified-By", "Conclusion-Evidence"
            ):
                for referenced_id, _ in self._refs(task.values(field_name)):
                    if referenced_id in all_evidence:
                        current_evidence.add(referenced_id)

        # A fresh summary/checkpoint must not hide a stale explicit
        # prerequisite. Traverse dependency edges, not historical coverage
        # (Verified-By/Covers), and stop at unselected human boundaries.
        pending = [*current_tasks, *(task_by_id[ref] for ref in current_evidence)]
        visited: set[str] = set()
        while pending:
            task = pending.pop()
            if task.task_id in visited or task.marker == "-":
                continue
            visited.add(task.task_id)
            if task.kind == "H" and task is not selected:
                continue
            if task.kind == "V":
                current_evidence.add(task.task_id)
            for ref, _ in self._refs([*task.values("Requires"), *task.values("Blocked-By")]):
                dependency = task_by_id.get(ref)
                if dependency is not None:
                    pending.append(dependency)

        return current_evidence

    def _validate_verification_tasks(
        self,
        ledger: ParsedLedger,
        task_by_id: dict[str, Task],
        status_header: dict[str, FieldValue],
    ) -> None:
        current_evidence_ids = self._current_evidence_ids(
            ledger, task_by_id, status_header
        )
        for task in ledger.tasks:
            if task.kind not in {"V", "H"}:
                continue

            gate_values = self._require_task_field(ledger, task, "Gate", "E080")
            gate = gate_values[0].value if gate_values else None
            if gate and gate not in ALLOWED_GATES:
                self.error("E081", ledger.path, gate_values[0].line, f"invalid Gate {gate!r}")
            if task.kind == "H" and gate and gate != "HUMAN":
                self.error("E082", ledger.path, gate_values[0].line, "H task Gate must be HUMAN")
            if task.kind == "V" and gate == "HUMAN":
                self.error("E083", ledger.path, gate_values[0].line, "V task Gate may not be HUMAN")

            if task.kind == "V":
                oracle_values = task.values("Oracle")
                if oracle_values:
                    oracle = oracle_values[0].value
                    if oracle not in ALLOWED_ORACLES:
                        self.error(
                            "E084", ledger.path, oracle_values[0].line, f"invalid Oracle {oracle!r}"
                        )
                if task.marker == "x":
                    mode = task.first("Evidence-Mode")
                    if mode is not None and mode.value == "HISTORICAL_RECORDED":
                        source_values = self._require_task_field(
                            ledger, task, "Evidence-Source", "E097"
                        )
                        if source_values and not self._archived_task_found(
                            source_values[0], task.task_id, marker="x"
                        ):
                            self.error(
                                "E098", ledger.path, source_values[0].line,
                                f"{task.task_id} is not recorded as verified in its archival source",
                            )
                        result_values = self._require_task_field(
                            ledger, task, "Result", "E088"
    def _validate_completion(self, ledger: ParsedLedger) -> None:
    raise SystemExit(main())

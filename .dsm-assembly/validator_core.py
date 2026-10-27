#!/usr/bin/env python3
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

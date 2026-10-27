#!/usr/bin/env python3
    def _validate_manifest_schema(self) -> None:
        for key in ("Milestone", "State", "Phase", "Active-Request"):
            elif task.values("Verified-By"):
                            ledger, task, "Result", "E088"
    def _validate_completion(self, ledger: ParsedLedger) -> None:
        state = ledger.header.get("State")
        phase = ledger.header.get("Phase")
        if state and state.value == "COMPLETE":
            unresolved = [task for task in ledger.tasks if task.marker not in {"x", "-"}]
            for task in unresolved:
                self.error(
                    "E130",
                    ledger.path,
                    task.line,
                    f"COMPLETE milestone contains unresolved task {task.task_id}",
                )
        if phase and phase.value == "HUMAN_VERIFICATION":
            if not any(task.kind == "H" and task.marker == "H" for task in ledger.tasks):
                self.warning(
                    "W130",
                    ledger.path,
                    phase.line,
                    "HUMAN_VERIFICATION phase has no [H] human-verification task",
                )

    MATERIAL_EXCLUDES = (
        "STATUS.md",
        "TASKS.md",
        "records/**",
        "experiences/retrievals.jsonl",
        ".durable-state/**",
    )

    def _run_git(self, args: Sequence[str]) -> bytes | None:
        try:
            return subprocess.check_output(
                ["git", "-C", str(self.root), *args], stderr=subprocess.DEVNULL
            )
        except (OSError, subprocess.CalledProcessError):
            return None

    def git_head(self) -> str | None:
        if self._git_head is None:
            output = self._run_git(["rev-parse", "HEAD"])
            self._git_head = output.decode("ascii").strip().lower() if output else ""
        return self._git_head or None

    def resolve_git_ref(self, ref: str) -> str | None:
        output = self._run_git(["rev-parse", "--verify", f"{ref}^{{commit}}"])
        return output.decode("ascii").strip().lower() if output else None

    def _material_pathspec(self) -> list[str]:
        return ["--", ".", *[f":(exclude){item}" for item in self.MATERIAL_EXCLUDES]]

    def _material_diff(self, base_ref: str) -> bytes | None:
        return self._run_git(
            ["diff", "--binary", "--no-ext-diff", base_ref, *self._material_pathspec()]
        )

    def _material_untracked_paths(self) -> list[bytes] | None:
        output = self._run_git(["ls-files", "--others", "--exclude-standard", "-z"])
        if output is None:
            return None
        excluded_exact = {"STATUS.md", "TASKS.md", "experiences/retrievals.jsonl"}
        paths: list[bytes] = []
        for encoded in output.split(b"\0"):
            if not encoded:
                continue
            decoded = encoded.decode("utf-8", errors="surrogateescape")
            if (
                decoded in excluded_exact
                or decoded.startswith("records/")
                or decoded.startswith(".durable-state/")
            ):
                continue
            paths.append(encoded)
        return sorted(paths)

    def material_changed_since(self, base_ref: str) -> bool | None:
        diff = self._material_diff(base_ref)
        untracked = self._material_untracked_paths()
        if diff is None or untracked is None:
            return None
        return bool(diff or untracked)

    def material_dirty(self) -> bool | None:
        if self._material_dirty is None:
            head = self.git_head()
            if not head:
                return None
            changed = self.material_changed_since(head)
            if changed is None:
                return None
            self._material_dirty = changed
        return self._material_dirty

    def worktree_fingerprint(self, base_ref: str) -> str | None:
        resolved = self.resolve_git_ref(base_ref)
        if not resolved:
            return None
        if resolved in self._worktree_fingerprints:
            return self._worktree_fingerprints[resolved]
        digest = hashlib.sha256()
        digest.update(b"durable-state-material-worktree-v1\0")
        digest.update(resolved.encode("ascii"))
        digest.update(b"\0")
        diff = self._material_diff(resolved)
        if diff is None:
            return None
        digest.update(diff)
        digest.update(b"\0UNTRACKED\0")
        paths = self._material_untracked_paths()
        if paths is None:
            return None
        for encoded_path in paths:
            try:
                relative = encoded_path.decode("utf-8", errors="surrogateescape")
                full_path = self.root / relative
                info = full_path.lstat()
            except OSError:
                return None
            digest.update(encoded_path)
            digest.update(b"\0")
            if stat.S_ISLNK(info.st_mode):
                digest.update(b"SYMLINK\0")
                digest.update(os.readlink(full_path).encode("utf-8", errors="surrogateescape"))
            elif stat.S_ISREG(info.st_mode):
                digest.update(b"FILE\0")
                try:
                    with full_path.open("rb") as handle:
                        while chunk := handle.read(1024 * 1024):
                            digest.update(chunk)
                except OSError:
                    return None
            else:
                digest.update(f"MODE={info.st_mode:o}".encode("ascii"))
            digest.update(b"\0")
        value = digest.hexdigest()
        self._worktree_fingerprints[resolved] = value
        return value

    def current_repository_state(self) -> str:
        head = self.git_head()
        if not head:
            raise RuntimeError(f"{self.root} is not a readable Git worktree")
        dirty = self.material_dirty()
        if dirty is False:
            return f"HEAD={head}; WORKTREE=CLEAN"
        fingerprint = self.worktree_fingerprint(head)
        if not fingerprint:
            raise RuntimeError("could not calculate material-worktree fingerprint")
        return f"HEAD={head}; DIFF-SHA256={fingerprint}"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate durable-state schema 2 without executing project commands."
    )
    parser.add_argument("directory", nargs="?", default=".", help="project directory")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="treat warnings, including stale repository evidence, as failure",
    )
    parser.add_argument("--json", action="store_true", help="emit machine-readable diagnostics")
    parser.add_argument(
        "--target-schema",
        choices=[SUPPORTED_SCHEMA_VERSION],
        help=argparse.SUPPRESS,
    )
    parser.add_argument(
        "--print-repository-state",
        action="store_true",
        help="print the current repository-state value and exit",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    root = Path(args.directory)
    if not root.is_dir():
        print(f"durable-state validator: directory does not exist: {root}", file=sys.stderr)
        return 2

    validator = Validator(root, strict=args.strict, target_schema=args.target_schema)
    if args.print_repository_state:
        try:
            print(validator.current_repository_state())
        except RuntimeError as exc:
            print(f"durable-state validator: {exc}", file=sys.stderr)
            return 2
        return 0

    diagnostics = validator.validate()
    if args.json:
        payload = {
            "schema_version": SUPPORTED_SCHEMA_VERSION,
            "project": str(validator.root),
            "valid": not validator.failed(),
            "strict": args.strict,
            "errors": sum(item.severity == "ERROR" for item in diagnostics),
            "warnings": sum(item.severity == "WARNING" for item in diagnostics),
            "diagnostics": [item.to_dict() for item in diagnostics],
        }
        print(json.dumps(payload, indent=2, sort_keys=True))
    else:
        for item in diagnostics:
            location = f"{item.path}:{item.line}" if item.line else item.path
            print(f"{item.severity} {item.code} {location}: {item.message}")
        errors = sum(item.severity == "ERROR" for item in diagnostics)
        warnings = sum(item.severity == "WARNING" for item in diagnostics)
        status = "VALID" if not validator.failed() else "INVALID"
        print(f"{status}: {errors} error(s), {warnings} warning(s)")

    return 1 if validator.failed() else 0


if __name__ == "__main__":
    raise SystemExit(main())

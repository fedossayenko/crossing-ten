---
name: verify
description: Run Crossing Ten's checks (types, generators, headless Chrome play-through) before a commit. Use before committing or when asked to verify a change.
---

1. `./verify.sh` from the repo root: tsc, then check.js and smoke.js at once. It prints each one's last line, or the failing log.
2. Only if the diff touches `worker/` or `js/sync.js`: the sync tests in AGENTS.md (Commands, "Sync"), on a local `wrangler dev` started with `--port 8787`; stop the server afterwards.

If a step fails, rerun it once. If it passes the second time, report it as a flake and name the step. If it fails twice, fix the cause. Never weaken a check to make it pass.
Report each step's last line.

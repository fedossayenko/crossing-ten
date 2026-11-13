---
name: verify
description: Run Crossing Ten's checks (types, generators, headless Chrome play-through) before a commit. Use before committing or when asked to verify a change.
---

1. `./verify.sh` from the repo root: tsc, check.js and smoke.js at once. It prints each one's last line, or the failing log.
2. Only if the diff touches `worker/` or `js/sync.js`: the sync tests in AGENTS.md (Commands, "Sync"), on a local `wrangler dev` started with `--port 8787`; stop the server afterwards.

A failure is investigated, never rerun and waved through: read the log, find why it fails and fix that (a second run that passes proves nothing about the first). If it fails only sometimes, that is a bug in the check or the app (a race, a fixed sleep, shared state) to find and fix. Never weaken a check to make it pass.
Report each step's last line.

---
name: verify
description: Run Crossing Ten's checks (types, generators, headless Chrome play-through) before a commit. Use before committing or when asked to verify a change.
---

Run from the repo root, use `/opt/homebrew/bin/node` (the plain `node` shim is broken), and stop at the first failure:

1. `npx -y -p typescript@7.0.2 tsc -p .` (types; must print nothing)
2. `node check.js`
3. `node smoke.js` (2 and 3 are independent: run them at once, `node check.js & node smoke.js; wait`, checking both exit codes)
4. Only if the diff touches `worker/` or `js/sync.js`: start `cd worker && npx wrangler@4 dev --local -c wrangler.toml --port 8787`, then `node worker/test.js` and `SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js`; stop the server afterwards.

When piping a step into `tail`, run with `set -o pipefail`, or a failing step reads as a pass.
If a step fails, rerun it once. If it passes the second time, report it as a flake and name the step. If it fails twice, fix the cause. Never weaken a check to make it pass.
Report each step's last line.

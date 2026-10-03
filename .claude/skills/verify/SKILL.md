---
name: verify
description: Run Crossing Ten's checks (generators, headless Chrome play-through, artifact build) before a commit. Use before committing or when asked to verify a change.
---

Run from the repo root, use `/opt/homebrew/bin/node` (the plain `node` shim is broken), and stop at the first failure:

1. `node check.js`
2. `node smoke.js`
3. `node build-artifact.js && node smoke.js artifact.html` (build in the repo; the artifact smoke fails from the scratchpad path)
4. Only if the diff touches `worker/` or `js/sync.js`: start `cd worker && npx wrangler@4 dev --local --port 8787`, then `node worker/test.js` and `SMOKE_SYNC=http://127.0.0.1:8787 node smoke.js`; stop the server afterwards.

If a step fails, rerun it once. If it passes the second time, report it as a flake and name the step. If it fails twice, fix the cause. Never weaken a check to make it pass.
Report each step's last line. `artifact.html` is gitignored, so step 3 leaves the tree clean.

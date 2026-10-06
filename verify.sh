#!/bin/sh
# Every check a commit must pass: types, generators, a headless-Chrome play-through.
# The verify skill and the pre-push hook (.githooks/pre-push) both run this; worker tests are in AGENTS.md.
# ponytail: checks the working tree, not the pushed commit; another session's uncommitted files count too.
cd "$(dirname "$0")" || exit 1
PATH=/opt/homebrew/bin:$PATH   # the plain `node` shim on this machine is broken
npx -y -p typescript@7.0.2 tsc -p . || { echo "verify: tsc failed"; exit 1; }
out=$(mktemp -d)
node check.js >"$out/check" 2>&1 & c=$!
node smoke.js >"$out/smoke" 2>&1 & s=$!
wait $c; cs=$?
wait $s; ss=$?
[ $cs = 0 ] && tail -1 "$out/check" || { tail -30 "$out/check"; echo "verify: check.js failed"; }
[ $ss = 0 ] && tail -1 "$out/smoke" || { tail -30 "$out/smoke"; echo "verify: smoke.js failed"; }
[ $cs = 0 ] && [ $ss = 0 ]

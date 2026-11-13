#!/bin/sh
# Every check a commit must pass: types, generators, a headless-Chrome play-through, all three at once.
# The verify skill and the pre-push hook (.githooks/pre-push) both run this; worker tests are in AGENTS.md.
# ponytail: checks the working tree, not the pushed commit; another session's uncommitted files count too.
cd "$(dirname "$0")" || exit 1
PATH=/opt/homebrew/bin:$PATH   # the plain `node` shim on this machine is broken
out=$(mktemp -d)
npx -y -p typescript@7.0.2 tsc -p . >"$out/tsc" 2>&1 & t=$!
node check.js >"$out/check" 2>&1 & c=$!
node smoke.js >"$out/smoke" 2>&1 & s=$!
wait $t; ts=$?
wait $c; cs=$?
wait $s; ss=$?
[ $ts = 0 ] && echo "tsc: ok" || { tail -30 "$out/tsc"; echo "verify: tsc failed"; }
[ $cs = 0 ] && tail -1 "$out/check" || { tail -30 "$out/check"; echo "verify: check.js failed"; }
[ $ss = 0 ] && tail -1 "$out/smoke" || { tail -30 "$out/smoke"; echo "verify: smoke.js failed"; }
rm -rf "$out"
[ $ts = 0 ] && [ $cs = 0 ] && [ $ss = 0 ]

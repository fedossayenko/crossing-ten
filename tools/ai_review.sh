#!/bin/bash
# AI code review with Claude Code (Opus) in print mode, using the rules in tools/review-rules.md.
#   tools/ai_review.sh --pre-push     the current branch against its upstream (the hook passes exact ranges instead)
#   tools/ai_review.sh --staged       what the next commit would record (run by hand before committing)
#   tools/ai_review.sh [FROM [TO]]    any range, default merge-base with origin/main..HEAD
# Blocks only on "VERDICT: BLOCK". A diff that already passed is not reviewed again (cache in
# .git/ai-review). No claude CLI, a failed call or an oversized diff: a message, and git goes on.
# Skip once: AI_REVIEW=0 on the command line of the push.
# The reviewer gets only Read/Grep/Glob: --restricted ignores user settings and no MCP or plugin
# tools load, so a prompt injection inside a diff cannot run anything.
set -uo pipefail
[ "${AI_REVIEW:-1}" = 0 ] && { echo "ai-review: skipped (AI_REVIEW=0)"; exit 0; }
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 0
MAX_LINES="${AI_REVIEW_MAX_LINES:-3000}"
MAX_BYTES="${AI_REVIEW_MAX_BYTES:-500000}"  # Cyrillic is 2 bytes a letter: a 34-level import diff is ~320 KB; one-line JSON slips past the line limit
TIMEOUT="${AI_REVIEW_TIMEOUT:-900}"
MODEL="${AI_REVIEW_MODEL:-opus}"
CACHE="$(git rev-parse --git-common-dir)/ai-review"
EMPTY_TREE="$(git hash-object -t tree /dev/null)"
# Recorded data and the vendored libraries are not reviewed: the checks that read them are.
SKIP=(-- . ":(exclude)check/golden.json" ":(exclude)check/seeds.json" ":(exclude)js/vendor/**" ":(exclude)*.png")

base_for() { git merge-base "$1" origin/main 2> /dev/null || echo "$EMPTY_TREE"; }

case "${1:-}" in
    --pre-push)
        from="$(git rev-parse -q --verify '@{upstream}' || base_for HEAD)"
        diff="$(git diff --no-color -U8 "$from" HEAD "${SKIP[@]}")"; range="${from:0:12}..HEAD" ;;
    --staged) diff="$(git diff --cached --no-color -U8 "${SKIP[@]}")"; range="staged changes" ;;
    *)
        to="${2:-HEAD}"; from="${1:-$(base_for "$to")}"
        diff="$(git diff --no-color -U8 "$from" "$to" "${SKIP[@]}")"; range="${from:0:12}..${to:0:12}" ;;
esac

[ -z "$diff" ] && { echo "ai-review: no changes"; exit 0; }
n="$(printf '%s\n' "$diff" | wc -l | tr -d ' ')"
bytes="$(printf '%s' "$diff" | wc -c | tr -d ' ')"
if [ "$n" -gt "$MAX_LINES" ] || [ "$bytes" -gt "$MAX_BYTES" ]; then
    echo "ai-review: the diff is $n lines, $bytes bytes (limits $MAX_LINES, $MAX_BYTES), skipped. Review parts: tools/ai_review.sh FROM TO"
    exit 0
fi
command -v claude > /dev/null || { echo "ai-review: claude CLI not found, skipped"; exit 0; }

key="$( (cat tools/review-rules.md; printf '%s' "$MODEL"; printf '%s\n' "$diff") | shasum -a 256 | cut -c1-16)"
mkdir -p "$CACHE"
if [ -f "$CACHE/$key.pass" ]; then echo "ai-review: this diff already passed ($key)"; exit 0; fi

echo "ai-review: $MODEL reviews $n diff lines ($range)..."
out="$(printf '%s\n' "$diff" | perl -e 'alarm shift; exec @ARGV' "$TIMEOUT" \
    claude -p "$(cat tools/review-rules.md)" --model "$MODEL" --restricted --tools "Read,Grep,Glob" \
        --strict-mcp-config --disallowedTools "mcp__*" --no-session-persistence 2>&1)"
rc=$?
printf '%s\n' "$out" | tee "$CACHE/last.txt"
if [ $rc -ne 0 ]; then echo "ai-review: claude failed (exit $rc), not blocking"; exit 0; fi
if printf '%s\n' "$out" | tail -3 | grep -q '^VERDICT: BLOCK'; then
    echo "ai-review: BLOCK. Fix the findings, or skip once with AI_REVIEW=0 on the push."
    exit 1
fi
if printf '%s\n' "$out" | tail -3 | grep -q '^VERDICT: PASS'; then
    printf '%s\n' "$out" > "$CACHE/$key.pass"
else
    echo "ai-review: no verdict line in the answer, not blocking (and not cached)"
fi
exit 0

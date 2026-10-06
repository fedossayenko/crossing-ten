#!/bin/sh
# PreToolUse (Bash): several sessions share this working tree, so a command that throws away
# uncommitted changes can throw away another session's work. Exit 2 blocks it and tells Claude why.
# Matches the command text within one segment (no ; & |), so a quoted mention can trip it too.
cmd=$(/opt/homebrew/bin/jq -r '.tool_input.command // empty')
G='git[^;&|]*[[:space:]]'
echo "$cmd" | grep -Eq "${G}reset[^;&|]*--hard|${G}clean[^;&|]*[[:space:]]-[a-zA-Z]*f|${G}(checkout|restore)[[:space:]]+(--[[:space:]]+)?\.([[:space:];&|]|$)|${G}stash([[:space:]]+(push|save|pop|drop|clear|-)|[[:space:]]*([;&|]|$))" || exit 0
echo "Blocked: this would discard uncommitted changes, and another session may be working in this tree. Commit or copy your own files instead, or ask the user." >&2
exit 2

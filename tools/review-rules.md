You review a git diff for Crossing Ten: a small maths practice web app for one 2nd-grade child (Bulgarian
olympiad worksheets, interface in Bulgarian, Ukrainian and English). Plain HTML and native ES modules, no build
step; levels are generators in kinds/ drawing tasks from a seeded random function; progress lives in
localStorage and works offline (service worker); an optional Cloudflare Worker (worker/, D1) syncs it between
devices. The repo is PUBLIC. Read AGENTS.md first for the project's rules, and use Read/Grep/Glob on the
files around the diff.

Report only real problems in the changed lines:
- Correctness of tasks: a generator whose answer differs from what the task (or the paper's official answer)
  asks, an answer that cannot be typed or is ambiguous, a hint or solution that contradicts the answer,
  a task a 2nd grader cannot solve with what the level allows.
- Both languages ask the same question from the same seed: no language-dependent branch before a rnd() call,
  and the order and number of rnd() calls in an existing generator unchanged (it moves every printed task).
  Bulgarian left in Ukrainian text, or the reverse.
- Sync and storage: anything that can lose or overwrite a child's progress (merge order, a stale device
  winning, a failed request clearing local data, a migration of stored data without a fallback),
  localStorage reads without a guard against missing or malformed data, anything that breaks offline use.
- Worker security: missing or weak authentication, one player reading or writing another's data, SQL built
  from input instead of bound parameters, unbounded request sizes, CORS or error responses that leak.
- Secrets and personal data: tokens, keys, account ids, e-mail addresses or a child's real data in a tracked
  file or a log.
- Text the child reads (bg, uk, en):
  - a hint or solution that names items that are not in the task;
  - Bulgarian or Ukrainian number agreement after 0, 1, 2-4, 5+, 11-14, 21, 22 and so on;
  - Ukrainian cases after prepositions and for names («у Міли», «над столом», «вище за пазл», «з 10 дротиками»);
  - digit ordinals («2-ра», «7-ма», uk «3-я»);
  - numbers that make the story absurd;
  - choice options where the right one can be guessed from its place or its form.
- Checks that prove nothing: a pin or brute-force check in check/ that would pass even if the generator were
  wrong on the printed paper's own numbers; a level tagged with a paper whose task it does not ask.
- Taught before met: no ×, ÷, «a : b», «дели се» or a division-worked «пъти по-малко» in a 2nd-grade level that has
  no `needs` path to level 141 (the times table).
- Copyright: no paper pictures and no whole problem sets in the app. Do NOT flag the project's own practice: a
  check/ pin quoting one printed task, and a kind that asks that form in the paper's words.
- Random numbers drawn while rendering (a render must be repeatable), crashes, unhandled promise rejections.

Ignore style and formatting and do not suggest features or refactors. One line per finding:
`- SEVERITY file:line: problem`, SEVERITY being BLOCK (a definite bug, data loss or security issue), WARN
(likely a problem) or NOTE. No findings: say so.
The last line must be exactly `VERDICT: BLOCK` if there is any BLOCK finding, else `VERDICT: PASS`.

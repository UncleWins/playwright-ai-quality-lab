---
description: Principal-level SDET review of the current branch vs main (run in a fresh session)
---
Act as a principal-level SDET reviewing this pull request. The bar: would you hold this
change up as the team's reference example?
Run `git diff main...HEAD` (explain the command first) and review the changes against @CLAUDE.md and @docs/SPEC.md.
Do not change any code.

Report issues grouped as BLOCKER / SHOULD-FIX / NIT. For each: file:line, what's wrong,
why it matters (in plain words), and a concrete fix.
Check: flakiness risks, locator quality, test independence, assertion strength, typing,
CI config, secrets exposure, TSDoc coverage, README and docs accuracy, commit hygiene.
End with: the 3 changes that would most raise the quality of this work.

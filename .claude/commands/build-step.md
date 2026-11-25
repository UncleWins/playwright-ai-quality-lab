---
description: Implement exactly one step from docs/PLAN.md, teaching as you go
argument-hint: <step number>
---
Implement Step $ARGUMENTS from @docs/PLAN.md, and only that step. Follow @CLAUDE.md.

Before editing:
- Explain what you'll change (files), why, and what you considered and rejected.
- Explain any new concept I need for this step in plain words.
- Wait for my OK.

While editing:
- Follow the CLAUDE.md quality bar. Add TSDoc to every exported function, class, fixture and type.
- Before running any terminal command, tell me what it does and what output to expect.

After editing:
- Run lint, typecheck and the relevant tests; show me the results.
- List the files changed.
- Tell me exactly how to verify it myself and what I should see.
- Propose ONE Conventional Commit message for this step (this becomes the "agreed" message once I accept or edit it).
- Give me 3 bullets: what I should learn from this step.
Do not commit or push.

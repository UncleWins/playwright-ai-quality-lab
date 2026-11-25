---
description: Update TSDoc, README and decision records for a step
argument-hint: <step number>
---
Update documentation for Step $ARGUMENTS of @docs/PLAN.md:
1. Add TSDoc to any exported code changed in this step that is missing it
   (summary, @remarks for the why, @param, @returns, @example if useful).
2. Update the README sections affected (Quickstart / Why I built it this way / Results).
   Use only real measured numbers; write TODO where a number is missing.
3. If we made a decision with a trade-off, write docs/decisions/<next-number>-<short-title>.md
   using docs/decisions/0000-template.md.
4. Tick the step's checkbox in docs/PLAN.md.
Show me every diff before saving and explain anything I might not understand.

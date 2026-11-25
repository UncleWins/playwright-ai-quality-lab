---
description: Plan a project from docs/SPEC.md and draft docs/PLAN.md (use in Plan mode)
---
Read @CLAUDE.md and @docs/SPEC.md. Do not write or change any code.

1. Restate the goal and the "Done when" criteria in your own words so I can confirm you understood.
2. List your assumptions and up to 8 questions you need me to answer. Wait for my answers before step 3.
3. Propose the architecture: folder structure, key libraries (why each + the alternative you
   rejected), and how tests and CI will run. Explain it for a mid-level QA engineer who is new to
   repo setup, Git and GitHub.
4. Draft the plan: 10-15 small steps. For each step give: goal, files touched, how I verify it
   (exact commands + what I should see), time estimate, and the concept I'll learn.
   Step 1 must be the smallest thing that runs green in CI.
5. After I approve, save the plan to docs/PLAN.md with a checkbox per step.

Optimize for correctness and a result a principal-level SDET would hold up as a reference, not for speed.

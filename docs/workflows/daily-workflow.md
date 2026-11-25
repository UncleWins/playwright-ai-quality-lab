# Daily build loop (one plan step = one loop)

The slash commands live in [`.claude/commands/`](../../.claude/commands/). Steps come from [docs/PLAN.md](../PLAN.md).

1. **Sync:** `git switch main`, then `git pull`, so you start from the latest code.
2. **Branch:** `git switch -c feat/<short-name>` creates a separate line of work for this step, so `main` stays clean.
3. **Build:** `/build-step <n>`. Read every diff and accept or reject it.
4. **Verify yourself:** run the commands Claude gave you. Red? Use `/debug <command + error output>`.
5. **Document:** `/document <n>`.
6. **Review (bigger steps):** `/review` in a fresh session. Fix the blockers.
7. **Ship:** `/ship <n>` (commit → push → PR), then watch CI with `gh pr checks --watch`.
8. **Merge:** once CI is green, `gh pr merge --squash --delete-branch`. This combines the branch into one clean commit on `main` and deletes the branch.
9. **Close the session:** `/teach-back`. Use `/handoff` if you'll continue in a new session.

Not sure what some code does? `/explain` works on a selection or the open diff at any time.

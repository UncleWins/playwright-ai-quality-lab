---
description: Commit, push and open a PR for a finished step, explaining every command
argument-hint: <step number>
---
Help me ship Step $ARGUMENTS. Before running each command, explain what it does and why.
1. Check `git status` and the current branch. If I'm on main, create branch feat/<short-name>.
2. Show me the agreed commit message from the build step. If we never agreed on one,
   propose one and wait for my confirmation.
3. Stage only the files that belong to this step (tell me if anything unrelated is changed). Commit.
4. Push (first push: `git push -u origin <branch>`).
5. Open a PR with `gh pr create`, filling the PR template: What / Why / How verified
   (commands + results) / Reports / Follow-ups.
6. Run `gh pr checks --watch` and tell me what the result means.
   If CI fails, stop and help me read the log; do not merge.
7. Only if CI is green and I say "merge": `gh pr merge --squash --delete-branch`,
   then `git switch main` and `git pull`.

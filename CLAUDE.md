# CLAUDE.md — playwright-ai-quality-lab

## About me
- Keene: Mid Test Automation Engineer (~3 yrs): Playwright/TS, Appium/WDIO, CI quality gates.
- New to Git/GitHub workflows and repo setup. I review every AI output and want to learn, not just ship.
- Standard: principal-level. Every change should be good enough to become the team's reference
  example: correct, deterministic, typed, documented, and boring to review.

## Source of truth
- What to build: @docs/SPEC.md
- Approved plan: @docs/PLAN.md (only work on the step I name)
- Past decisions: docs/decisions/

## Environment
- Windows + VS Code. Docker: NOT available — never require it, locally or in CI.
- Local = CI: the app and tests start with the same npm commands on my laptop and in GitHub Actions.
- Node LTS, npm.

## How to work with me (teaching mode, always)
1. Before changing anything, tell me WHAT you will change (files), WHY (reasoning + the
   alternative you rejected), and HOW I will verify it. Wait for my OK on anything non-trivial.
2. Work on ONE plan step at a time. Stop at the end of the step.
3. Before running any terminal command, explain what it does, why it's needed, and what output to expect.
4. After each step, give me: files changed, exact commands to verify, what I should see,
   and ONE proposed Conventional Commit message. Do not commit or push unless I ask.
5. If anything is ambiguous, ask instead of guessing. If unsure an API or flag exists in the
   installed version, say so and check (package.json, node_modules types, or docs).
6. Prefer simple, readable code. No new dependency without explaining why and its cost.
7. Quality over speed: never stub or fake results to look done.

## Quality bar (non-negotiable)
- TypeScript strict mode; no `any` without a comment explaining why.
- Tests: no hard waits (waitForTimeout), no test-to-test dependence, test data created via API/fixtures.
- Locators: getByRole > getByLabel > getByPlaceholder > getByText > getByTestId > CSS/XPath (last resort, with a comment).
- Every test has a meaningful web-first assertion. Lint + typecheck + tests pass before a step is done.
- README numbers come only from real measured runs. Never invent metrics.

## Documentation rules
- TSDoc on every exported function, class, fixture and type (summary, @remarks for why, @param, @returns, @example when useful).
- Comments explain WHY, not WHAT.
- Update README when behavior changes. Add docs/decisions/NNNN-<title>.md for decisions with trade-offs.

## Git rules
- One branch per plan step: feat/<short-name>. Conventional Commits:
  feat (framework capability), fix, test (test cases only), docs, ci, refactor, chore.
- Never commit secrets. .env, .auth/ and docs/personal/ stay git-ignored; CI uses GitHub Actions secrets.

## Commands (keep updated; run /init after real code exists and review its suggestions)
- Install: npm ci
- Lint: npm run lint (ESLint + Prettier check)  | Typecheck: npm run typecheck
- Format (auto-fix): npm run format
- Tests: npx playwright test  | Smoke: npx playwright test --grep @smoke
- Report: npx playwright show-report
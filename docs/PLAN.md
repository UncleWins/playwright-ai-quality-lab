# Plan — playwright-ai-quality-lab (Project 1)

> Approved at kickoff on 2026-11-19. WHAT to build lives in [SPEC.md](SPEC.md); this file is HOW and in what order.
> Work on one step at a time. Tick a box only when its PR is merged.

## Milestones (target dates, 2026)

| Milestone | Steps | Target |
|---|---|---|
| M1: Foundation: toolchain, app, first smoke in CI | 1–3 | **Nov 30** |
| M2: Framework + main suite | 4–9 | **Dec 8** |
| M3: Regression, flake tracker, AI gate + promotions | 10–13 | **Dec 17** |
| M4: Experiment + final README | 14–15 | **Dec 21** |

### If I fall behind: cut in this order
1. **Experiment: 8 scenarios → 5.** Say so in `docs/experiment.md` (fewer data points, weaker conclusion).
2. **Firefox.** Chromium only. The spec allows "Chromium + one more" as an upper bound, not a requirement.
3. **Extra shards.** Stay at 2 shards and skip the 1/2/4 measurement. Don't go below 2: "sharded" is a Done-when item.

Anything cut gets one line under "What I'd do next" in the README.

## Decisions made at kickoff

| Topic | Decision |
|---|---|
| App under test | Backend `realworld-hono-drizzle@1.0.6` (npm, SQLite via libsql) + frontend `mutoe/vue3-realworld-example-app` at a pinned commit SHA. Bun-based official API/Angular rejected (extra tools, `make` not on Windows) |
| Same origin | Our own `app/server.ts` serves the built Vue files and mounts the Conduit Hono app under `/api` on one port, because the backend sends no CORS headers |
| Frontend sourcing | `npm run setup` clones the pinned SHA into git-ignored `.app/`, runs `npx pnpm@10.33.0 install --frozen-lockfile`, builds. CI caches it by SHA |
| `JWT_SECRET` | Pinned explicitly. The backend's default is random on every start, which would invalidate saved sessions |
| Second browser | Firefox, nightly regression only (not in the PR gate) |
| Shards | Start at 2. Step 10 measures 1/2/4 and records real numbers |
| AI agents | `npx playwright init-agents --loop=claude`, run on the Claude Code subscription. No API key |
| Flake + experiment runs | GitHub Actions (manual workflow), 20 runs |
| Experiment | Keene writes the human versions alone. ~8 scenarios that exist nowhere else in the repo. Promoted AI tests are a separate set |
| Not added | faker, tsx/ts-node, husky, dotenv (Node 24 runs `.ts` natively; builders + `randomUUID` give unique data; CI is the gate) |

## Architecture (summary)

```
npm run setup   → clone Vue app @SHA → build into .app/frontend/dist → install Playwright browsers
npx playwright test
  └─ webServer "npm run app:start" → app/server.ts on http://localhost:3000
        ├─ /api/* → realworld-hono-drizzle (SQLite .app/data/conduit.db)
        └─ /*     → built Vue files (SPA fallback)
  └─ project setup    → user via API, UI login once, saves .auth/user.json
  └─ project chromium → full suite (PR gate runs @smoke only)
  └─ project firefox  → nightly regression only
```

Folders: `app/` (server), `scripts/` (setup, reset, flake report), `src/{api,data,fixtures,pages}`,
`tests/{api,ui}` (main suite), `tests/ai-generated/` (quarantine), `tests/experiment/{human,ai}/`,
`specs/` (agent plans), `docs/decisions/`. CI: `pr.yml` (lint → typecheck → smoke, required by ruleset),
`regression.yml` (nightly, sharded, merged report), `flake-runs.yml` (manual, N runs → flake table).

## Steps

Each step = one branch, one PR, one Conventional Commit. Every step ends with `npm run lint` and
`npm run typecheck` green plus the step's own checks.

### M1: Foundation (target Nov 30)

- [ ] **Step 1: Toolchain + first green CI (lint + typecheck)** · `feat/toolchain` · ~3 h · target **Nov 30**
  - Goal: smallest thing green in CI. Also commits the starter files and makes file names consistent: CLAUDE.md (title, `@docs/SPEC.md` / `@docs/PLAN.md` refs, delete the AI-evals block) and the slash commands that still say `docs/plan.md` (`kickoff.md`, `handoff.md`, `build-step.md`, `document.md`) → `docs/PLAN.md`.
  - Files: `package.json`, `package-lock.json`, `.nvmrc`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `playwright.config.ts` (minimal), `.github/workflows/pr.yml`, `.gitignore`, `CLAUDE.md`, `.claude/commands/{kickoff,handoff,build-step,document}.md`, `README.md` (skeleton), commit the rest of `.claude/commands/` and `docs/`.
  - Verify: `npm ci` → no errors; `npm run lint` → exit 0; `npm run typecheck` → exit 0; `node --input-type=module-typescript -e "const n: number = 1; console.log(n)"` → `1`; `git grep -n -i -E "docs/(spec|plan)\.md" -- CLAUDE.md .claude` → every hit is uppercase `SPEC.md`/`PLAN.md`; PR → `gh pr checks --watch` shows `lint ✓ typecheck ✓`.
  - Concept: npm scripts, lockfile + `npm ci`, strict TS, ESLint flat config, GitHub Actions jobs, why file-name case matters on Linux runners.

- [ ] **Step 2: App under test runs locally on one origin** · `feat/app-under-test` · ~4 h · target **Nov 30**
  - Files: `scripts/setup-app.ts`, `scripts/reset-app.ts`, `app/server.ts`, `package.json` (exact `realworld-hono-drizzle@1.0.6`, `hono`, `@hono/node-server`), `docs/decisions/0001-app-under-test.md`.
  - Verify: `npm run setup` → frontend built; `npm run app:start` → listening on :3000; `curl http://localhost:3000/api/tags` → `{"tags":[]}`; sign up + publish in the browser; reload `/article/<slug>` → renders; stop server, `npm run app:reset` → DB file gone.
  - Concept: provisioning a SUT, CORS / same-origin, pinning, cross-platform Node scripts.

- [ ] **Step 3: Playwright webServer + first smoke test in CI** · `feat/smoke-ci` · ~3 h · target **Nov 30**
  - Files: `playwright.config.ts` (webServer, baseURL, chromium, reporters, retries), `tests/ui/home.spec.ts`, `.github/workflows/pr.yml` (smoke job, `.app` cache), README "How to run" (`npm ci`, `npm run setup`, `npm test`).
  - Verify: no server running → `npx playwright test --grep @smoke` → 1 passed; with `npm run app:start` running → reused, no port error; PR → `smoke ✓`; 2nd CI run shows cache restored.
  - Concept: `webServer` + `reuseExistingServer`, CI cache keys, browser install.

### M2: Framework + main suite (target Dec 8)

- [ ] **Step 4: Protect main with a ruleset** · `docs/ruleset` · ~1.5 h · target **Dec 8**
  - Files: README "Branch protection" (+ screenshot). Ruleset set in GitHub Settings → Rules (or `gh api`, explained).
  - Verify: throwaway PR with a lint error → `lint ✗`, merge blocked; `gh api repos/UncleWins/playwright-ai-quality-lab/rulesets` lists it.
  - Concept: rulesets, required status checks, stable job names.

- [ ] **Step 5: API client, typed builders, fixtures + first API tests** · `feat/api-layer` · ~4 h · target **Dec 8**
  - Files: `src/api/conduit-client.ts`, `src/data/builders.ts`, `src/fixtures/index.ts`, `tests/api/auth.api.spec.ts`, `docs/decisions/0003-data-strategy.md`.
  - Verify: `npx playwright test tests/api` → 4 passed; `--repeat-each=5 --workers=4` → 20 passed.
  - Concept: `test.extend` fixtures, builder pattern, unique data for parallelism.

- [ ] **Step 6: Auth once + page objects + sign-up/login UI tests** · `feat/auth-setup` · ~4 h · target **Dec 8**
  - Files: `tests/auth.setup.ts`, `playwright.config.ts` (setup project, `dependencies`, `storageState`), `src/pages/{nav-bar,home,login,register}.page.ts`, `src/fixtures/index.ts` (`pageAs(user)`), `tests/ui/auth.spec.ts`, `docs/decisions/0002-auth-strategy.md`.
  - Verify: `npx playwright test` → setup first, all pass; delete `.auth/` → regenerated; `--list` shows the setup dependency.
  - Concept: `storageState`, project dependencies, intent-revealing page objects, locator priority.

- [ ] **Step 7: Articles: create/edit/delete (UI + API)** · `feat/article-tests` · ~3.5 h · target **Dec 8**
  - Files: `src/pages/{editor,article}.page.ts`, `tests/ui/article.spec.ts`, `tests/api/articles.api.spec.ts`.
  - Verify: `npx playwright test --grep "article"` → ~7 passed; no `waitForTimeout` anywhere (lint enforces).
  - Concept: UI vs API layer per assertion, web-first assertions, arrange via API / act via UI.

- [ ] **Step 8: Social: comments, favorite, follow (UI + API)** · `feat/social-tests` · ~3.5 h · target **Dec 8**
  - Files: `src/pages/profile.page.ts`, `tests/ui/{comments,favorite,follow}.spec.ts`, `tests/api/social.api.spec.ts`.
  - Verify: `npx playwright test --grep "comment|favorite|follow"` → all pass; `--repeat-each=3 --workers=4` green.
  - Concept: multi-user scenarios, isolating user-scoped state.

- [ ] **Step 9: Feeds: tag filter + pagination; finalize smoke set** · `feat/feed-tests` · ~3 h · target **Dec 8**
  - Files: `tests/ui/feed.spec.ts`, `tests/api/feed.api.spec.ts`, `@smoke` tags across specs.
  - Verify: `npx playwright test --list` → 25–32 tests; `--grep @smoke --list` → 6–8; full run green twice in a row.
  - Concept: deterministic list data (unique tag per test), designing a smoke set.

### M3: Regression, flake tracker, AI gate (target Dec 17)

- [ ] **Step 10: Nightly sharded regression + Firefox + merged report** · `ci/regression` · ~3.5 h · target **Dec 17**
  - Files: `playwright.config.ts` (firefox, blob reporter in CI), `.github/workflows/regression.yml`, README "Results" (measured 1/2/4 shards).
  - Verify: `gh workflow run regression.yml` + `gh run watch` → shards + `merge-reports` green; `gh run download <id> -n html-report` → one report, both browsers, traces.
  - Concept: sharding, blob reports + `merge-reports`, cron (UTC), artifacts.
  - Cut candidates: Firefox (cut #2), the 1/2/4 measurement (cut #3).

- [ ] **Step 11: Flake tracker (20 CI runs → markdown table)** · `feat/flake-tracker` · ~4 h · target **Dec 17**
  - Files: `scripts/flake-report.ts`, `scripts/flake-report.test.ts`, `.github/workflows/flake-runs.yml`, README results.
  - Verify: `node --test scripts/` → pass; `node scripts/flake-report.ts <fixture-dir>` → table; `gh workflow run flake-runs.yml -f runs=20` → job summary table from real runs.
  - Concept: JSON reporter schema, defining flake rate, testing your tooling.

- [ ] **Step 12: AI review gate infrastructure** · `feat/ai-gate` · ~3 h · target **Dec 17**
  - Files: `.claude/agents/*` + `.mcp.json` (from `npx playwright init-agents --loop=claude`), `tests/seed.spec.ts`, `tests/ai-generated/`, `playwright.config.ts` (`testIgnore` + `ai-generated` project), `.github/CODEOWNERS`, `docs/review-checklist.md`, `docs/decisions/0004-ai-review-gate.md`, README "AI review gate".
  - Verify: `npx playwright test --list` excludes ai-generated; `--project=ai-generated --list` includes them; PR touching `tests/` shows @UncleWins as code owner.
  - Concept: quarantine, CODEOWNERS, limits of solo-repo gates.

- [ ] **Step 13: AI-written coverage + 3 promotion PRs** · `test/promote-<name>` (one per PR) · ~5 h · target **Dec 17**
  - Goal: agents cover scenarios not written in steps 5–9 (e.g. settings, logout, profile tabs, delete comment). ≥3 promotions, each its own PR with checklist + fix log.
  - Verify: each PR: checklist complete, gate green, moved test passes `--repeat-each=5`.
  - Concept: critical review of AI output, healer agent, small PRs.

### M4: Experiment + final README (target Dec 21)

- [ ] **Step 14: AI-vs-human experiment** · `docs/experiment` (+ test branches) · ~8–10 h · target **Dec 21**
  - Goal: ~8 new scenarios (cut #1: 5). Keene writes `tests/experiment/human/` alone and timed. Agents write `tests/experiment/ai/`. Same checklist, fixes counted. 20 CI runs each.
  - Files: `tests/experiment/**`, `playwright.config.ts` (experiment project), `docs/experiment.md`.
  - Verify: every number in `docs/experiment.md` links to a workflow run or PR.
  - Concept: experimental design, confounders, honest reporting.

- [ ] **Step 15: Final README, decisions index, video, `/init` review** · `docs/final-readme` · ~3 h · target **Dec 21**
  - Files: `README.md` (Playbook order), `CLAUDE.md` (commands after `/init` review).
  - Verify: fresh clone on Windows → the 3 README commands pass; every SPEC "Done when" box links to evidence.
  - Concept: presenting engineering work truthfully.

## Open issues
Risks to verify early (each has a step that checks it):
- `@libsql/client` native binary on Windows x64 (step 2).
- Vue build with empty `VITE_API_HOST` calls `/api` same-origin; router needs SPA fallback (step 2).
- Node 24 runs `.ts` without flags (step 1).
- Upstream Vue markup has enough roles/labels for good locators (steps 2, 6).
- SQLite `SQLITE_BUSY` under parallel workers (steps 9–11).
- `init-agents` output paths and targeting `tests/ai-generated/` (step 12).

Schedule risk: at ~15 h/week, M2 (≈19.5 h in 8 days) and M4 (≈11–13 h in 4 days, plus 20 CI runs) are tight.
If M2 slips past Dec 8, apply cut #1 early so the experiment fits in M4.

## Next session starts here
Kickoff done and plan saved. Start with `/build-step 1` on branch `feat/toolchain`.

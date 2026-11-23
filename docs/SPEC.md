# Spec: Project 1, AI-assisted Playwright framework

> This file says WHAT to build. HOW and in what order goes in docs/PLAN.md (made by /kickoff).
> This version replaces the Playbook's Project 1 section for this repo.

## Goal in one line
A Playwright + TypeScript E2E and API test framework for a real blogging app. It runs the same way
on my laptop and in GitHub Actions, and it measures how AI-written tests compare to mine.

## Like I'm 5
I build a robot that uses a blog website the way a person would: signs up, logs in, writes a post,
comments. An AI helper also writes some robot instructions, but its work doesn't count until I've
graded it. At the end I compare who wrote better instructions, me or the AI.

## Constraints (hard rules)
- **No Docker, anywhere.** I can't install it. Nothing may depend on it, locally or in CI.
- **Local = CI.** The app and tests start with the same npm commands on my Windows laptop and on
  the GitHub Actions runner. If something only works in one place, it isn't done.
- **Windows + VS Code**, Node LTS, npm. Explain any extra tool before adding it.
- **$0 to run.** Public repo (free GitHub Actions minutes), free and open-source tools only.
  No paid AI API calls in this project.
- I'm new to repo setup, Git and GitHub. Teach as you go (see CLAUDE.md).

## App under test: RealWorld "Conduit"
Conduit is a Medium-style blogging app from the RealWorld project. The same app is built in
many frontends and backends that all follow one shared API spec, which makes it a realistic test target:
sign-up/login, articles, comments, favorites, follows, tags, and a documented REST API.

Requirements for the version I run:
- Frontend + backend run locally with npm. **No separate database install** (no MongoDB, Postgres,
  MySQL). A file-based database like SQLite is fine.
- I can reset the data to a clean state before a test run.
- Pin exact versions (a commit SHA or package version) so results are reproducible.

Starting candidates for /kickoff to verify (don't assume; check each README and confirm it works on Windows):
- Backend: `realworld-hono-drizzle` (runs with `npx`, stores data in a local SQLite file).
- Backend: the official RealWorld reference implementation (Prisma + SQLite).
- Frontend: any maintained RealWorld frontend that starts with `npm` and can point at a local API URL.

**Decision needed:** /kickoff proposes 2–3 frontend+backend pairs, says which is simplest and
why, and asks me before choosing. Record the choice in `docs/decisions/0001-app-under-test.md`.

**How the app starts:** Playwright's `webServer` config starts the app automatically before tests,
both locally and in CI. Locally it reuses an app I already have running; in CI it always starts fresh.

## Scope

### In
1. **Framework:** page objects, custom fixtures, typed test data builders, tags (`@smoke`, `@regression`).
2. **Auth once:** a setup project logs in and saves session state; tests reuse it.
3. **API-seeded data:** tests create their own users/articles through the API, never through the UI
   (except the tests that cover those UI flows). No test depends on another test.
4. **Test coverage (UI + API):** sign-up, login (valid/invalid), create/edit/delete article,
   comment, favorite, follow, tag filter, pagination. Roughly 25–40 meaningful tests, not more.
5. **Parallel + sharding:** tests run in parallel locally; CI regression shards across runners and
   merges into one HTML report.
6. **CI on GitHub Actions:**
   - On every PR: lint → typecheck → smoke tests. Must pass to merge.
   - Nightly (scheduled) and on demand: full regression, sharded, with the HTML report and traces
     uploaded as artifacts.
7. **Flake tracker:** a small script reads Playwright's JSON results from repeated runs and reports
   flake rate per test (passed only on retry, or inconsistent across runs). Output: a markdown table.
8. **AI-written tests behind a review gate:**
   - Playwright's test agents (planner, generator, healer) write tests into `tests/ai-generated/`.
   - That folder is **not** part of the PR gate. A test is promoted by moving it into the main test
     folder through its own PR, which I review against a checklist (locators, assertions, data, no waits).
   - `CODEOWNERS` names me as owner of the test folders. (GitHub can't make me approve my own PR,
     so the promotion PR plus checklist is the real gate. Explain this in the README.)
9. **AI vs human experiment:** for ~8 scenarios, I hand-write one version and the agents write
   another. Compare authoring time, flake rate over 20 runs, and fixes needed before it passed review.
   Results in `docs/experiment.md`, from real measured runs only.

### Out (don't build)
- Visual regression, performance/load testing, mobile, cross-browser beyond Chromium + one more.
- Any paid service, cloud test grid, or paid AI API.
- Docker or devcontainers.

## Done when
- [ ] A fresh clone runs on Windows with ≤3 commands in the README (install, start app, test).
- [ ] The same commands pass in GitHub Actions. PR gate (lint, typecheck, smoke) is green and
      required on `main` via a ruleset.
- [ ] Nightly regression runs sharded and uploads a merged HTML report.
- [ ] Zero `waitForTimeout`; every test has a web-first assertion; data is API-seeded.
- [ ] Flake tracker produces a real flake-rate table from at least 20 runs.
- [ ] At least 3 AI-generated tests promoted through the review gate, with the review notes in each PR.
- [ ] `docs/experiment.md` has the AI vs human results and an honest conclusion.
- [ ] README follows the Playbook order: what/why, 3-minute video link, architecture, how to run,
      results (real numbers), decisions, what I'd do next.
- [ ] Decision records exist for: app under test, auth strategy, data strategy, AI review gate.

## Questions /kickoff must answer before planning
1. Which Conduit frontend + backend pair, and how do we reset its data between runs?
2. Which second browser, and is it worth the CI time?
3. How many shards, given the free runner limits and a 25–40 test suite?
4. What exact command sets up Playwright's test agents for Claude Code in the installed version?
# playwright-ai-quality-lab

[![PR gate](https://github.com/UncleWins/playwright-ai-quality-lab/actions/workflows/pr.yml/badge.svg)](https://github.com/UncleWins/playwright-ai-quality-lab/actions/workflows/pr.yml)

A Playwright + TypeScript E2E and API test framework for the RealWorld "Conduit" blogging app,
with AI-written tests kept behind a human review gate, and a measured comparison of AI-written vs
hand-written tests.

> **Status: under construction.** Step 1 of 15 in [docs/PLAN.md](docs/PLAN.md): toolchain and PR
> gate (lint + typecheck). Sections below marked _TODO_ are filled in by later steps, with real
> measured numbers only.

## What and why

- **What:** UI + API tests for Conduit (sign-up, login, articles, comments, favorites, follows, tags,
  pagination) that run the same way on Windows and in GitHub Actions. No Docker, $0 to run.
- **Why:** to show a production-grade framework (page objects, fixtures, typed builders, API-seeded
  data, sharded CI, flake tracking) and to answer a practical question honestly: _are AI-generated
  Playwright tests as good as hand-written ones, and what does it take to make them so?_

Full scope: [docs/SPEC.md](docs/SPEC.md).

## Video walkthrough

_TODO (Step 15): 3-minute video link._

## Architecture

_TODO (Steps 2–3): diagram and description._ The planned design is summarized in
[docs/PLAN.md](docs/PLAN.md#architecture-summary).

## How to run

Requirements: Windows, macOS or Linux, Node.js `24.20.0` (see [.nvmrc](.nvmrc)), npm.

```bash
npm ci             # install exact dependency versions from package-lock.json
npm run lint       # ESLint (incl. Playwright rules) + Prettier check
npm run typecheck  # TypeScript strict mode, no output files
```

_TODO (Step 3): `npm run setup` and `npm test` once the app under test and the first tests exist._

## Results

_TODO: test counts, CI timings, flake rates and the AI-vs-human experiment, from real runs only._

## Decisions

Architecture decision records live in [docs/decisions/](docs/decisions/). _TODO: index once the first
record (0001, app under test) exists in Step 2._

## What I'd do next

_TODO (Step 15)._

## License

[MIT](LICENSE)

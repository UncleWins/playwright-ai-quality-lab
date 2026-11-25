import { defineConfig } from '@playwright/test';

/**
 * Shared Playwright configuration for local and CI runs.
 *
 * @remarks
 * Deliberately minimal in Step 1: there is no app to test yet, so no `webServer`, `baseURL`
 * or projects. Step 3 adds them together with the first real smoke test. `forbidOnly` is set
 * now because a stray `test.only` silently shrinks a CI run to one test and still shows green.
 */
export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
});

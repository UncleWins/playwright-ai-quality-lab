import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Generated or third-party output: linting it would only produce noise we can't fix.
  globalIgnores(['.app/', 'playwright-report/', 'test-results/', 'blob-report/']),

  js.configs.recommended,

  {
    files: ['**/*.ts'],
    // Type-aware rules catch bugs plain linting can't see, e.g. a forgotten `await`
    // (no-floating-promises), which is a classic source of flaky Playwright tests.
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },

  {
    files: ['tests/**/*.ts', 'src/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    // The recommended preset only *warns* on these. The CLAUDE.md quality bar makes them
    // non-negotiable, so they are errors and fail CI.
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/expect-expect': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-force-option': 'error',
    },
  },
);

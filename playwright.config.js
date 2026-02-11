// @ts-nocheck
// This file is checked by Node.js at runtime, not TypeScript
const { defineConfig } = require('@playwright/test');
const { urls } = require('./tests/test-data/urls');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Environment configuration helper
 * Switch between environments by changing the active URLs object
 *
 * Supported environments:
 * - urls.live: Production (sportland.ee, sportland.com, sportland.lv)
 * - urls.demo: Demo environments (demo-sportland-lv, dev-pfr-pl)
 * - urls.dev: Development environment (sportland-dev-nkx-lv)
 */
const activeUrls = urls.demo; // Change to urls.demo or urls.dev for other environments

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on test failure. See https://playwright.dev/docs/screenshots */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'sportland-ee',
      use: {
        baseURL: activeUrls.sportlandEe,
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },

    {
      name: 'sportland-com',
      use: {
        baseURL: activeUrls.sportlandCom,
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },

    {
      name: 'sportland-lv',
      use: {
        baseURL: activeUrls.sportlandLv,
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },

    {
      name: 'sportland-pl',
      use: {
        baseURL: activeUrls.sportlandPl,
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  /* Run your local dev server before starting the tests. */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

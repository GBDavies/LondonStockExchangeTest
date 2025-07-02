import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 150 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  use: {
    headless: true,
    screenshot: "on",
    video: "retain-on-failure",
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 0,
  },
  projects: [
    /* Test against desktop */

    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "Firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "WebKit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile */

    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
  retries: 1,
  reporter: [["list"], ["html", { open: "never" }]],
});

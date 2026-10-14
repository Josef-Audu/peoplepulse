import { defineConfig, devices } from "@playwright/test";

/**
 * Signed-out acceptance only: no credentials, no test users, no production
 * data touched. Authenticated creator/participant flows are covered by the
 * manual acceptance script (Clerk sessions cannot be minted headlessly here).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PP_BASE_URL ?? "http://127.0.0.1:3110",
    trace: "retain-on-failure",
  },
  webServer: process.env.PP_BASE_URL
    ? undefined
    : {
        command: "npm.cmd run start -- -p 3110",
        url: "http://127.0.0.1:3110/",
        reuseExistingServer: true,
        timeout: 120000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

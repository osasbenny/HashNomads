import { defineConfig } from "@playwright/test";
const deploymentURL = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  use: {
    baseURL: deploymentURL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: deploymentURL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});

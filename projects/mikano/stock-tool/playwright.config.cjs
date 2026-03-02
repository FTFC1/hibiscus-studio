const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '*.spec.cjs',
  timeout: 30000,
  use: {
    headless: true,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
    baseURL: 'http://localhost:3847',
  },
  webServer: {
    command: 'npx serve -l 3847 -s .',
    port: 3847,
    reuseExistingServer: true,
    timeout: 10000,
  },
  retries: 1,
  reporter: [['list']],
});

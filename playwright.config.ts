import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8081',
  },
  webServer: {
    command: 'python3 -m http.server 8081',
    cwd: 'public',
    port: 8081,
    reuseExistingServer: true,
  },
});


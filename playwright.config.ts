import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: require.resolve('./tests/global-setup.ts'),
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    actionTimeout: 0,
    trace: 'on-first-retry',
    storageState: path.resolve(__dirname, 'tests/.auth/state.json'),
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

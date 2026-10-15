import { defineConfig, devices } from '@playwright/test';

const target = new URL(process.env.BASE_URL || 'https://thayrinesouza.com');
if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password || target.pathname !== '/' || target.search || target.hash) {
  throw new Error('BASE_URL must be an HTTP(S) origin without credentials, path, query or fragment.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: 'list',
  outputDir: '.test-results',
  preserveOutput: 'never',
  use: {
    baseURL: target.origin,
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    reducedMotion: 'reduce',
    acceptDownloads: false,
    screenshot: 'off',
    trace: 'off',
    video: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } }],
});

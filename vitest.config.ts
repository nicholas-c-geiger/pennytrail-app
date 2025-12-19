import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    // Only include unit tests and component tests placed under `test/` and `components/`.
    // This prevents Playwright E2E tests in `tests/` from being picked up by Vitest.
    include: [
      'test/**/*.{test,spec}.{ts,tsx,js,jsx}',
      'components/**/*.{test,spec}.{ts,tsx,js,jsx}',
    ],
  },
});

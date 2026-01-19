import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    timeout: 60000, // 60s per test (site creation can be slow)
    use: {
        baseURL: process.env.APP_URL || 'https://orbit-web.ccc',
        trace: 'on-first-retry',
        // Ignore HTTPS errors for self-signed certificates (.ccc domains)
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});

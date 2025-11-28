import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: '../test/e2e',
    outputDir: '../test/e2e/test-results',
    reporter: [
        ['html', { outputFolder: '../test/e2e/report' }],
        ['json', { outputFile: '../test/e2e/results.json' }]
    ],
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});

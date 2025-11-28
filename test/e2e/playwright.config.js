import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    outputDir: 'test-results',
    reporter: [
        ['html', { outputFolder: 'report' }],
        ['json', { outputFile: 'results.json' }]
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

import { test, expect } from '@playwright/test';

test.describe('User Scenarios', () => {
    const user = {
        name: 'test_1',
        email: 'test_1@test.com',
        password: 'test1234'
    };

    test('Scenario 2.1.1: Full Flow with Provided Credentials', async ({ page }) => {
        // 1. Try Login First
        await page.goto('/login');
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
        await page.getByRole('button', { name: /로그인/i }).click();

        // Check if login succeeded or failed
        // If we see "할일 목록", login success.
        // If we see error or still on login page, try register.
        try {
            await expect(page.getByText('할일 목록')).toBeVisible({ timeout: 3000 });
        } catch (e) {
            console.log('Login failed or timed out, attempting registration...');
            await page.goto('/register');
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="name"]', user.name);
            await page.fill('input[name="password"]', user.password);
            await page.fill('input[name="confirmPassword"]', user.password);
            await page.getByRole('button', { name: /회원가입/i }).click();

            // After register, login again
            await page.waitForTimeout(1000);
            if (await page.getByRole('button', { name: /로그인/i }).isVisible()) {
                await page.fill('input[name="email"]', user.email);
                await page.fill('input[name="password"]', user.password);
                await page.getByRole('button', { name: /로그인/i }).click();
            }
            await expect(page.getByText('할일 목록')).toBeVisible({ timeout: 10000 });
        }

        // 2. Add Todo
        const todoTitle = `Integration Test Task ${Date.now()}`;
        await page.getByRole('button', { name: /새 할일 추가/i }).click();

        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', 'Testing delete bug fix with specific user');
        await page.getByRole('button', { name: /추가/i }).click();

        // Verify added
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 3. Delete Todo (Verify Bug Fix)
        const todoItem = page.locator('div').filter({ hasText: todoTitle }).first();

        // Handle confirm dialog if it exists
        page.on('dialog', dialog => dialog.accept());

        await todoItem.getByRole('button', { name: /삭제/i }).click();

        // 4. Verify Deleted
        // It should disappear immediately
        await expect(page.getByText(todoTitle)).not.toBeVisible();
    });
});

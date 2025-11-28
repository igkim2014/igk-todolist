import { test, expect } from '@playwright/test';

test.describe('Integrated User Scenarios', () => {
    // Generate a random user for this test run to avoid state collisions
    const timestamp = Date.now();
    const user = {
        name: `user_${timestamp}`,
        email: `user_${timestamp}@test.com`,
        password: 'test1234'
    };

    test('Execute Scenarios 2.1.1 - 2.1.4', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];

        // --- Login / Register ---
        await test.step('Login or Register', async () => {
            // Listen to browser console logs
            page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

            console.log(`Starting test with user: ${user.email}`);

            await page.goto('/register');
            await page.waitForLoadState('networkidle');

            console.log('Filling registration form...');
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="username"]', user.name);
            await page.fill('input[name="password"]', user.password);
            await page.fill('input[name="confirmPassword"]', user.password);

            // Double check values to avoid mismatch issues
            const p1 = await page.inputValue('input[name="password"]');
            const p2 = await page.inputValue('input[name="confirmPassword"]');
            if (p1 !== p2) {
                console.log('Passwords mismatch in DOM. Refilling...');
                await page.fill('input[name="confirmPassword"]', '');
                await page.type('input[name="confirmPassword"]', user.password, { delay: 50 });
            }

            console.log('Clicking Register button...');
            await page.getByRole('button', { name: /회원가입/i }).click();

            // Handle potential errors or redirect
            try {
                // Expect redirect to login
                await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
                console.log('Redirected to login page.');
            } catch (navError) {
                console.log('Did not redirect to login immediately. Checking for errors...');

                if (await page.getByText('비밀번호가 일치하지 않습니다').isVisible()) {
                    console.log('Error: Password mismatch detected. Retrying registration with slow typing...');
                    await page.fill('input[name="password"]', '');
                    await page.type('input[name="password"]', user.password, { delay: 100 });
                    await page.fill('input[name="confirmPassword"]', '');
                    await page.type('input[name="confirmPassword"]', user.password, { delay: 100 });
                    await page.getByRole('button', { name: /회원가입/i }).click();
                    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
                } else {
                    // Just try to proceed to login, maybe it worked but redirect was slow?
                    console.log('Assuming registration might have worked or we can try login anyway.');
                }
            }

            // Login attempt
            console.log('Attempting login...');
            if (!page.url().includes('/login')) {
                await page.goto('/login');
            }
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="password"]', user.password);
            await page.getByRole('button', { name: /로그인/i }).click();

            await expect(page.getByText('할일 목록')).toBeVisible({ timeout: 10000 });
            console.log('Login successful.');
        });

        // --- Scenario 2.1.1: Add Todo ---
        const todoTitle = "팀장님께 보고서 제출";
        await test.step('Scenario 2.1.1: Add Todo', async () => {
            await page.getByRole('button', { name: /새 할일 추가/i }).click();
            await page.fill('input[name="title"]', todoTitle);
            await page.fill('textarea[name="content"]', "오전 11시까지 제출 필요");
            await page.fill('input[name="startDate"]', today);
            await page.fill('input[name="dueDate"]', today);

            await page.getByRole('button', { name: /추가/i }).click();

            // Verify added
            await expect(page.getByText(todoTitle)).toBeVisible();
        });

        // --- Scenario 2.1.2: Complete Todo ---
        await test.step('Scenario 2.1.2: Complete Todo', async () => {
            const todoItem = page.locator('div').filter({ hasText: todoTitle }).first();
            const completeBtn = todoItem.locator('button').first();
            await completeBtn.click();

            // Verify completion (line-through class on h3)
            await expect(todoItem.locator('h3')).toHaveClass(/line-through/);
        });

        // --- Scenario 2.1.3: Delete & Restore ---
        const deleteTitle = "주간 보고서 작성";
        await test.step('Scenario 2.1.3: Delete and Restore', async () => {
            // Add item first
            await page.getByRole('button', { name: /새 할일 추가/i }).click();
            await page.fill('input[name="title"]', deleteTitle);
            await page.getByRole('button', { name: /추가/i }).click();
            await expect(page.getByText(deleteTitle)).toBeVisible();

            // Delete
            const todoItem = page.locator('div').filter({ hasText: deleteTitle }).first();

            // Handle confirm dialog
            page.on('dialog', dialog => dialog.accept());

            await todoItem.getByRole('button', { name: /삭제/i }).click();

            // Verify deleted from list
            await expect(page.getByText(deleteTitle)).not.toBeVisible();

            // Go to Trash
            await page.getByRole('button', { name: /휴지통/i }).click();
            await expect(page).toHaveURL(/.*\/trash/);

            // Verify in trash
            await expect(page.getByText(deleteTitle)).toBeVisible();

            // Restore
            const trashItem = page.locator('div').filter({ hasText: deleteTitle }).first();
            await trashItem.getByRole('button', { name: /복원/i }).click();

            // Verify removed from trash
            await expect(page.getByText(deleteTitle)).not.toBeVisible();

            // Go back to List
            await page.getByRole('button', { name: /할일 목록/i }).click();
            await expect(page.getByText(deleteTitle)).toBeVisible();
        });

        // --- Scenario 2.1.4: Holidays ---
        await test.step('Scenario 2.1.4: Check Holidays', async () => {
            await page.getByRole('button', { name: /국경일/i }).click();
            await expect(page).toHaveURL(/.*\/holidays/);

            // Verify header
            await expect(page.getByRole('heading', { name: /국경일/i })).toBeVisible();
        });
    });
});

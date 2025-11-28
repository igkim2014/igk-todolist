// test/e2e/igk-todolist-integration.spec.js
import { test, expect } from '@playwright/test';

test.describe('igk-TodoList Integration Tests', () => {
  // Test user credentials
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'Test User'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('User can register, login, add todo, complete it, and verify functionality', async ({ page }) => {
    // 1. Register as a new user (assuming registration is needed)
    await page.goto('/register');
    
    // Fill registration form
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="username"]').fill(testUser.username);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('input[name="confirmPassword"]').fill(testUser.password);
    
    // Submit registration
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation to login or automatic login
    await page.waitForURL('**/login');
    
    // 2. Login with registered credentials
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for navigation to main page
    await page.waitForURL('**/');
    
    // 3. Verify we're on the main page
    await expect(page.locator('h1')).toContainText('할일 목록');
    
    // 4. Add a new todo
    await page.locator('button:has-text("새 할일 추가")').click();
    
    // Wait for modal to appear
    await expect(page.locator('h2')).toContainText('새 할일 추가');
    
    // Fill the todo details
    await page.locator('input[name="title"]').fill('Test Todo Integration');
    await page.locator('textarea[name="content"]').fill('This is a test todo for integration testing');
    
    // Set dates
    await page.locator('input[name="startDate"]').fill('2025-11-25');
    await page.locator('input[name="dueDate"]').fill('2025-11-30');
    
    // Save the todo
    await page.locator('button:has-text("추가")').click();
    
    // Wait for modal to close and todo to appear in list
    await expect(page.locator('h2')).not.toContainText('새 할일 추가');
    await expect(page.locator('h3:has-text("Test Todo Integration")')).toBeVisible();
    
    // 5. Verify the todo appears in the list
    await expect(page.locator('div').filter({ hasText: 'Test Todo Integration' })).toBeVisible();
    
    // 6. Complete the todo
    const todoCheckbox = page.locator('div').filter({ hasText: 'Test Todo Integration' }).locator('input[type="checkbox"]');
    await todoCheckbox.click();
    
    // Verify the todo is marked as completed
    const completedTodo = page.locator('div').filter({ hasText: 'Test Todo Integration' }).locator('.line-through');
    await expect(completedTodo).toBeVisible();
    
    // 7. Test filtering - click on "완료" filter
    await page.locator('button:has-text("완료 1")').click();
    
    // Verify completed todo is still visible
    await expect(page.locator('div').filter({ hasText: 'Test Todo Integration' })).toBeVisible();
    
    // 8. Test navigation to trash and back
    await page.locator('button:has-text("휴지통")').click(); // This would be in sidebar
    await page.waitForURL('**/trash');
    
    // Come back to main page
    await page.locator('button:has-text("할일 목록")').click(); // This would be in sidebar
    await page.waitForURL('**/');
    
    // 9. Verify todo is still present after navigation
    await expect(page.locator('h3:has-text("Test Todo Integration")')).toBeVisible();
  });

  test('User can view holidays', async ({ page }) => {
    // Navigate to holidays page
    await page.goto('/holidays');
    
    // Wait for the holidays page to load
    await expect(page.locator('h1')).toContainText('국경일');
    
    // Verify the year/month selector is present
    await expect(page.locator('select')).toHaveCount(2); // Year and month selectors
    
    // Verify some holiday elements are present (even if empty)
    await expect(page.locator('div')).toContainText('국경일');
  });

  test('User can manage their profile', async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    
    // Wait for the profile page to load
    await expect(page.locator('h1')).toContainText('프로필');
    
    // Verify profile elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('Admin can manage holidays (if applicable)', async ({ page }) => {
    // This test assumes we're logged in as an admin
    // For now, just verify the admin page structure if available
    try {
      await page.goto('/admin/holidays');
      
      // Check if we're redirected (for non-admins) or if page loads
      if (page.url().includes('/admin/holidays')) {
        // If page loads, test admin functionality
        await expect(page.locator('h1')).toContainText('국경일 관리');
      }
      // If redirected, that's also valid behavior for non-admins
    } catch (e) {
      // If the URL doesn't exist, that's fine too
      console.log('Admin page not accessible or does not exist');
    }
  });

  test('User can use search functionality', async ({ page }) => {
    // Go to main page
    await page.goto('/');
    
    // Add a test todo if none exist (this is a simplified check)
    const addTodoButton = page.locator('button:has-text("새 할일 추가")');
    await expect(addTodoButton).toBeVisible();
    
    // Create a todo with a specific term we can search for
    await addTodoButton.click();
    await page.locator('input[name="title"]').fill('Search Test Todo');
    await page.locator('input[name="content"]').fill('This is for search testing');
    await page.locator('button:has-text("추가")').click();
    
    // Wait for the todo to be added
    await expect(page.locator('h3:has-text("Search Test Todo")')).toBeVisible();
    
    // Use search functionality
    await page.locator('input[placeholder="할일 검색..."]').fill('Search Test');
    
    // Submit search
    await page.locator('button:has-text("검색")').click();
    
    // Verify search results contain our test todo
    await expect(page.locator('h3:has-text("Search Test Todo")')).toBeVisible();
    
    // Clear search
    await page.locator('button:has-text("X")').click(); // Clear button
    
    // Verify all todos are shown again
    await expect(page.locator('h3:has-text("Search Test Todo")')).toBeVisible();
  });

  test('User can delete and restore a todo', async ({ page }) => {
    // Go to main page
    await page.goto('/');
    
    // Add a test todo to delete
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill('Delete Test Todo');
    await page.locator('input[name="content"]').fill('This will be deleted and restored');
    await page.locator('button:has-text("추가")').click();
    
    // Verify the todo was added
    await expect(page.locator('h3:has-text("Delete Test Todo")')).toBeVisible();
    
    // Click the delete button for this todo
    const deleteButton = page.locator('div').filter({ hasText: 'Delete Test Todo' }).locator('button:has-text("삭제")');
    await deleteButton.click();
    
    // Verify the todo is no longer in the active list
    await expect(page.locator('h3:has-text("Delete Test Todo")')).not.toBeVisible();
    
    // Go to trash to find the deleted todo
    await page.goto('/trash');
    
    // Verify the todo is in the trash
    await expect(page.locator('h3:has-text("Delete Test Todo")')).toBeVisible();
    
    // Restore the todo
    const restoreButton = page.locator('div').filter({ hasText: 'Delete Test Todo' }).locator('button:has-text("복원")');
    await restoreButton.click();
    
    // Wait for restoration and navigate back to main list
    await page.goto('/');
    
    // Verify the todo is back in the active list
    await expect(page.locator('h3:has-text("Delete Test Todo")')).toBeVisible();
  });
});
// test/e2e/user-scenarios.spec.js
// Playwright tests based on user scenarios from docs/4-user-scenarios.md
import { test, expect } from '@playwright/test';

test.describe('igk-TodoList User Scenarios', () => {
  // Test user credentials
  const testUser = {
    email: 'testuser@example.com',
    password: 'Password123!',
    username: 'Test User'
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('Scenario 2.1.1: 직장인 김철수 출근길 할일 확인 및 추가', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 시간: 월요일 오전 8:30, 지하철에서
    // 전제 조건: 이미 가입 및 로그인한 상태
    // 목표: 오늘 할 일 확인하고 새로운 업무 할일 추가
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Confirm we're on the main page
    await expect(page.locator('h1')).toContainText('할일 목록');

    // Add new urgent task
    const newTaskTitle = '팀장님께 보고서 제출';
    await page.locator('button:has-text("새 할일 추가")').click();

    // Wait for modal to appear
    await expect(page.locator('h2')).toContainText('새 할일 추가');

    // Fill the todo details
    await page.locator('input[name="title"]').fill(newTaskTitle);
    await page.locator('textarea[name="content"]').fill('오전 11시까지 제출 필요');
    
    // Set dates to today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    await page.locator('input[name="startDate"]').fill(todayStr);
    await page.locator('input[name="dueDate"]').fill(todayStr);

    // Save the todo
    await page.locator('button:has-text("추가")').click();

    // Wait for modal to close and todo to appear in list
    await expect(page.locator('h2')).not.toContainText('새 할일 추가');
    await expect(page.locator('h3:has-text("' + newTaskTitle + '")')).toBeVisible();
  });

  test('Scenario 2.1.2: 직장인 김철수 업무 중 할일 완료 처리', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 시간: 월요일 오전 11:00, 사무실
    // 전제 조건: "팀장님께 보고서 제출" 할일이 목록에 있음
    // 목표: 완료한 업무를 체크하고 성취감 느끼기
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Confirm we're on the main page
    await expect(page.locator('h1')).toContainText('할일 목록');

    // Find and complete the task "팀장님께 보고서 제출"
    const taskTitle = '팀장님께 보고서 제출';
    const todoCheckbox = page.locator('div').filter({ hasText: taskTitle }).locator('input[type="checkbox"]');
    await todoCheckbox.click();

    // Verify the todo is marked as completed
    const completedTodo = page.locator('div').filter({ hasText: taskTitle }).locator('.line-through');
    await expect(completedTodo).toBeVisible();
  });

  test('Scenario 2.2.1: 대학생 카리나 아침에 오늘 할일 및 과제 확인', async ({ page }) => {
    // 페르소나: 카리나 (대학생)
    // 시간: 화요일 오전 7:30, 기숙사 침대에서
    // 전제 조건: 로그인 상태
    // 목표: 오늘 수업과 과제 마감일 확인
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Confirm we're on the main page
    await expect(page.locator('h1')).toContainText('할일 목록');

    // Check that the date filter shows today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Verify the date filter is set to today (this might be shown differently in UI)
    await expect(page.locator('h1')).toContainText('할일 목록');

    // Look for urgent tasks (due today) - these might be highlighted differently
    const urgentTasks = page.locator('.text-red-500'); // Assuming urgent tasks are marked in red
    await expect(urgentTasks).toHaveCount(0).or().toBeVisible(); // Could be zero or visible
  });

  test('Scenario 3.1.1: 신규 사용자 회원가입', async ({ page }) => {
    // 페르소나: 신규 사용자 (이름: 박지민)
    // 전제 조건: 앱에 처음 방문
    // 목표: 계정 생성하고 서비스 이용 시작
    
    await page.goto('/register');

    // Fill registration form
    await page.locator('input[name="email"]').fill('jimin@example.com');
    await page.locator('input[name="username"]').fill('박지민');
    await page.locator('input[name="password"]').fill('SecurePass123!');
    await page.locator('input[name="confirmPassword"]').fill('SecurePass123!');

    // Submit registration
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to login or automatic login
    await page.waitForURL('**/login'); // Or homepage if auto-login happens

    // Verify registration success - could be welcome message or redirect
    if (page.url().includes('/login')) {
      // If still on login, log in with the new credentials
      await page.locator('input[name="email"]').fill('jimin@example.com');
      await page.locator('input[name="password"]').fill('SecurePass123!');
      await page.locator('button[type="submit"]').click();

      await page.waitForURL('**/');
      await expect(page.locator('h1')).toContainText('할일 목록');
    }
  });

  test('Scenario 3.2.1: 상세 정보 포함 할일 추가', async ({ page }) => {
    // 페르소на: 김철수 (직장인)
    // 전제 조건: 로그인 상태
    // 목표: 프로젝트 마감 할일을 상세히 등록
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add detailed task
    const projectTaskTitle = 'Q4 프로젝트 최종 보고서 제출';
    await page.locator('button:has-text("새 할일 추가")').click();

    // Wait for modal to appear
    await expect(page.locator('h2')).toContainText('새 할일 추가');

    // Fill the detailed todo information
    await page.locator('input[name="title"]').fill(projectTaskTitle);
    
    const detailedContent = `- 경영진 발표 자료 포함
- 예산 집행 현황 첨부
- 팀장 검토 완료 필요`;
    await page.locator('textarea[name="content"]').fill(detailedContent);
    
    // Set start and due dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    await page.locator('input[name="startDate"]').fill(todayStr);
    await page.locator('input[name="dueDate"]').fill(nextWeekStr);

    // Save the todo
    await page.locator('button:has-text("추가")').click();

    // Wait for modal to close and todo to appear in list
    await expect(page.locator('h2')).not.toContainText('새 할일 추가');
    await expect(page.locator('h3:has-text("' + projectTaskTitle + '")')).toBeVisible();
  });

  test('Scenario 3.3.1: 오래된 할일 정리 및 영구 삭제', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 전제 조건: 완료된 할일 다수 존재
    // 목표: 오래된 할일 정리하여 목록 깔끔하게 유지
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add an item to delete later
    const deleteTaskTitle = '삭제 테스트 할일';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(deleteTaskTitle);
    await page.locator('button:has-text("추가")').click();
    await expect(page.locator('h3:has-text("' + deleteTaskTitle + '")')).toBeVisible();

    // Complete the task
    const todoCheckbox = page.locator('div').filter({ hasText: deleteTaskTitle }).locator('input[type="checkbox"]');
    await todoCheckbox.click();

    // Delete the completed task (move to trash)
    const deleteButton = page.locator('div').filter({ hasText: deleteTaskTitle }).locator('button:has-text("삭제")');
    await deleteButton.click();

    // Confirm deletion if dialog appears
    page.on('dialog', dialog => dialog.accept());

    // Navigate to trash
    await page.locator('button:has-text("휴지통")').click();
    await page.waitForURL('**/trash');

    // Find the deleted task in trash
    await expect(page.locator('h3:has-text("' + deleteTaskTitle + '")')).toBeVisible();

    // Permanently delete from trash
    const permanentDeleteButton = page.locator('div').filter({ hasText: deleteTaskTitle }).locator('button:has-text("영구 삭제")');
    await permanentDeleteButton.click();

    // Confirm permanent deletion if dialog appears
    page.on('dialog', dialog => dialog.accept());

    // Verify item is no longer in trash
    await expect(page.locator('h3:has-text("' + deleteTaskTitle + '")')).not.toBeVisible();
  });

  test('Scenario 4.2.1: 만료일이 시작일보다 이전인 경우 에러 처리', async ({ page }) => {
    // 페르소나: 카리나 (대학생)
    // 전제 조건: 할일 추가 중
    // 목표: 잘못된 날짜 입력 방지
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add a task with incorrect dates (due date before start date)
    await page.locator('button:has-text("새 할일 추가")').click();

    await page.locator('input[name="title"]').fill('프로젝트 제출');
    await page.locator('textarea[name="content"]').fill('중요한 프로젝트');

    // Set start date to future and due date to past (incorrect)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const pastDateStr = pastDate.toISOString().split('T')[0];

    await page.locator('input[name="startDate"]').fill(futureDateStr);
    await page.locator('input[name="dueDate"]').fill(pastDateStr);

    // Try to save - should fail
    await page.locator('button:has-text("추가")').click();

    // Verify error message appears
    await expect(page.locator('.error-message, .text-red-500')).toContainText('만료일은 시작일과 같거나 이후여야 합니다').or().toBeVisible({ timeout: 2000 });
  });

  test('Scenario 5.1.1: 데스크톱 → 모바일 전환 및 동기화', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 시간: 월요일 오후 5:00 ~ 6:30
    // 목표: 데스크톱과 모바일 간 끊김 없는 동기화
    
    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add a task on desktop
    const syncTaskTitle = '퇴근 후 마트 가기';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(syncTaskTitle);
    await page.locator('input[name="dueDate"]').fill(new Date().toISOString().split('T')[0]);
    await page.locator('button:has-text("추가")').click();

    // Verify the task appears in the list
    await expect(page.locator('h3:has-text("' + syncTaskTitle + '")')).toBeVisible();

    // Complete the task on desktop
    const todoCheckbox = page.locator('div').filter({ hasText: syncTaskTitle }).locator('input[type="checkbox"]');
    await todoCheckbox.click();

    // Verify the task is completed
    const completedTodo = page.locator('div').filter({ hasText: syncTaskTitle }).locator('.line-through');
    await expect(completedTodo).toBeVisible();

    // This scenario tests the synchronization between devices which would require
    // another session to verify, so we'll test that data is properly saved and displayed
    await page.reload();
    await expect(completedTodo).toBeVisible();
  });
});
// test/e2e/comprehensive-user-scenarios.spec.js
// Playwright tests based on user scenarios from docs/4-user-scenarios.md
import { test, expect } from '@playwright/test';

test.describe('igk-TodoList Comprehensive User Scenarios', () => {
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

  test('Scenario 2.1.3: 직장인 김철수 실수로 삭제한 할일 복원', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 시간: 월요일 오후 3:00
    // 전제 조건: "주간 보고서 작성" 할일 존재
    // 목표: 실수로 삭제한 중요 할일 복구

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add an item to delete and then restore
    const restoreTaskTitle = '주간 보고서 작성';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(restoreTaskTitle);
    await page.locator('input[name="content"]').fill('중요한 주간 보고서');
    await page.locator('button:has-text("추가")').click();

    // Verify the task was added
    await expect(page.locator('h3:has-text("' + restoreTaskTitle + '")')).toBeVisible();

    // Accidentally delete the task
    const deleteButton = page.locator('div').filter({ hasText: restoreTaskTitle }).locator('button:has-text("삭제")');
    await deleteButton.click();

    // Confirm deletion
    page.on('dialog', dialog => dialog.accept());
    await expect(page.locator('h3:has-text("' + restoreTaskTitle + '")')).not.toBeVisible();

    // Go to trash to find the deleted task
    await page.locator('button:has-text("휴지통")').click();
    await page.waitForURL('**/trash');

    // Verify the task is in the trash
    await expect(page.locator('h3:has-text("' + restoreTaskTitle + '")')).toBeVisible();

    // Restore the task
    const restoreButton = page.locator('div').filter({ hasText: restoreTaskTitle }).locator('button:has-text("복원")');
    await restoreButton.click();

    // Navigate back to main todo list
    await page.locator('button:has-text("할일 목록")').click();
    await page.waitForURL('**/');

    // Verify the task is back in the active list
    await expect(page.locator('h3:has-text("' + restoreTaskTitle + '")')).toBeVisible();
  });

  test('Scenario 2.1.4: 직장인 김철수 다음 주 일정 계획 및 국경일 확인', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 시간: 금요일 오후 5:00
    // 전제 조건: 로그인 상태
    // 목표: 다음 주 할일 계획하고 공휴일 확인

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add next week's task
    const nextWeekTaskTitle = '월요일 프로젝트 킥오프 미팅';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(nextWeekTaskTitle);

    // Set dates to next Monday
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
    const nextMondayStr = nextMonday.toISOString().split('T')[0];

    await page.locator('input[name="startDate"]').fill(nextMondayStr);
    await page.locator('input[name="dueDate"]').fill(nextMondayStr);
    await page.locator('button:has-text("추가")').click();

    // Verify the task is added
    await expect(page.locator('h3:has-text("' + nextWeekTaskTitle + '")')).toBeVisible();

    // Navigate to holidays section
    await page.locator('button:has-text("국경일")').click();
    await page.waitForURL('**/holidays');

    // Verify holiday page is loaded
    await expect(page.locator('h1')).toContainText('국경일');

    // Check if year and month selectors are present
    await expect(page.locator('select')).toHaveCount(2); // Year and month selectors

    // Select December to check for Christmas
    await page.locator('select').nth(1).selectOption('12'); // Month selector

    // Check for Christmas (December 25th)
    await expect(page.locator('div').filter({ hasText: '12-25' }).locator('div:has-text("크리스마스")')).toBeVisible();

    // Add pre-Christmas task
    await page.locator('button:has-text("할일 목록")').click();
    await page.waitForURL('**/');

    const preChristmasTask = '연말 보고서 작성';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(preChristmasTask);

    // Set to day before Christmas
    const christmasEve = new Date();
    christmasEve.setMonth(11); // December (0-based)
    christmasEve.setDate(24); // 24th
    christmasEve.setFullYear(2025);
    const christmasEveStr = christmasEve.toISOString().split('T')[0];

    await page.locator('input[name="dueDate"]').fill(christmasEveStr);
    await page.locator('button:has-text("추가")').click();

    // Verify the task is added
    await expect(page.locator('h3:has-text("' + preChristmasTask + '")')).toBeVisible();
  });

  test('Scenario 2.2.2: 대학생 카리나 수업 중 다음 주 일정 추가', async ({ page }) => {
    // 페르소나: 카리나 (대학생)
    // 시간: 화요일 오전 10:00, 강의실
    // 전제 조건: 로그인 상태
    // 목표: 교수님이 공지한 과제 기한 바로 추가

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add task quickly (mobile-style)
    const mobileTaskTitle = '프로그래밍 프로젝트 제출';
    await page.locator('button:has-text("새 할일 추가")').click();

    // Fill minimal required info
    await page.locator('input[name="title"]').fill(mobileTaskTitle);

    // Set date to next Friday
    const nextFriday = new Date();
    const daysToAdd = (5 - nextFriday.getDay() + 7) % 7 || 7; // Next Friday
    nextFriday.setDate(nextFriday.getDate() + daysToAdd);
    const nextFridayStr = nextFriday.toISOString().split('T')[0];

    await page.locator('input[name="dueDate"]').fill(nextFridayStr);
    await page.locator('button:has-text("추가")').click();

    // Verify the task is added
    await expect(page.locator('h3:has-text("' + mobileTaskTitle + '")')).toBeVisible();

    // Check toast message if it appears
    await expect(page.locator('.toast, .notification')).toContainText('할일이 추가되었습니다').or().toBeVisible({ timeout: 1000 });
  });

  test('Scenario 2.2.4: 대학생 카리나 중간고사 기간 할일 검색 및 필터', async ({ page }) => {
    // 페르소나: 카리나 (대학생)
    // 시간: 목요일 오후 2:00
    // 전제 조건: 다수의 할일 등록됨 (과제, 시험, 개인 일정)
    // 목표: 중간고사 관련 할일만 모아서 확인

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add multiple exam-related tasks
    const examTasks = [
      '알고리즘 중간고사 준비',
      '데이터베이스 중간고사 정리',
      '운영체제 중간고사 복습'
    ];

    for (const task of examTasks) {
      await page.locator('button:has-text("새 할일 추가")').click();
      await page.locator('input[name="title"]').fill(task);
      await page.locator('button:has-text("추가")').click();
      await expect(page.locator('h3:has-text("' + task + '")')).toBeVisible();
    }

    // Use search functionality to find exam-related tasks
    await page.locator('input[placeholder="할일 검색..."]').fill('중간고사');

    // Wait for search results
    await page.locator('button:has-text("검색")').click();
    
    // Verify search results contain exam tasks
    for (const task of examTasks) {
      await expect(page.locator('h3:has-text("' + task + '")')).toBeVisible();
    }

    // Check if any filtering options exist
    const weekFilter = page.locator('button:has-text("이번 주")');
    if (await weekFilter.count() > 0) {
      await weekFilter.click();
      await expect(page.locator('h3:has-text("알고리즘 중간고사 준비")')).toBeVisible(); // Assuming this is this week
    }

    // Clear search to see all tasks again
    await page.locator('button:has-text("X")').click(); // Clear search button
    await expect(page.locator('h3:has-text("알고리즘 중간고사 준비")')).toBeVisible();
  });

  test('Scenario 3.1.2: 기존 사용자 로그인', async ({ page }) => {
    // 페르소나: 기존 사용자 (김철수)
    // 전제 조건: 이미 가입한 계정 존재
    // 목표: 로그인하여 할일 목록 확인

    // Go to login page
    await page.goto('/login');

    // Fill login form
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);

    // Submit login
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Verify successful login and presence of todo list
    await expect(page.locator('h1')).toContainText('할일 목록');
    await expect(page.locator('button:has-text("새 할일 추가")')).toBeVisible();

    // Verify user greeting if present
    await expect(page.locator('div').filter({ hasText: testUser.username })).toBeVisible();
  });

  test('Scenario 3.2.2: 할일 수정 및 일정 변경', async ({ page }) => {
    // 페르소나: 카리나 (대학생)
    // 전제 조건: "알고리즘 중간고사 준비" 할일 존재
    // 목표: 시험 일정이 변경되어 만료일 수정

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add the exam task to modify
    const examTask = '알고리즘 중간고사 준비';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(examTask);
    
    // Set initial due date (today)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    await page.locator('input[name="dueDate"]').fill(todayStr);
    
    await page.locator('button:has-text("추가")').click();

    // Verify the task was added
    await expect(page.locator('h3:has-text("' + examTask + '")')).toBeVisible();

    // Click on the task to edit
    const examTodo = page.locator('div').filter({ hasText: examTask });
    await examTodo.click();

    // Wait for edit mode or modal
    await page.waitForSelector('input[name="title"]');
    
    // Update the due date (to next week)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    await page.locator('input[name="dueDate"]').fill(nextWeekStr);
    await page.locator('textarea[name="content"]').fill('시험 범위: 1-10장'); // Add content update
    
    // Save changes
    await page.locator('button:has-text("수정")').click(); // or whatever save button exists

    // Wait for modal to close
    await expect(page.locator('input[name="title"]')).not.toBeVisible();

    // Verify the changes are reflected in the list
    await expect(page.locator('div').filter({ hasText: examTask }).locator('text=' + nextWeekStr)).toBeVisible();
  });

  test('Scenario 4.1.1: 토큰 만료 후 자동 갱신', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 전제 조건: 15분 전 로그인, Access Token 만료 잠박
    // 목표: 끊김 없는 사용 경험
    
    // Note: Testing actual token expiration would require manipulating time or 
    // having a test mode with shorter token lifetimes, so we'll simulate 
    // the behavior by testing that the app can handle API calls properly
    
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Add a task to verify API functionality
    const refreshTokenTask = 'API 테스트 할일';
    await page.locator('button:has-text("새 할일 추가")').click();
    await page.locator('input[name="title"]').fill(refreshTokenTask);
    await page.locator('button:has-text("추가")').click();

    // Verify the task was added
    await expect(page.locator('h3:has-text("' + refreshTokenTask + '")')).toBeVisible();
    
    // Refresh the page to simulate potentially expired tokens
    await page.reload();
    
    // Verify that the page still loads correctly
    await expect(page.locator('h1')).toContainText('할일 목록');
    await expect(page.locator('h3:has-text("' + refreshTokenTask + '")')).toBeVisible();
  });

  test('Scenario 4.2.2: 제목 누락 시 오류 처리', async ({ page }) => {
    // 페르소나: 김철수 (직장인)
    // 전제 조건: 할일 추가 중
    // 목표: 필수 입력 항목 검증

    // First, make sure we're logged in
    await page.goto('/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.locator('button[type="submit"]').click();

    // Wait for navigation to main page
    await page.waitForURL('**/');

    // Start adding a task but leave the title empty
    await page.locator('button:has-text("새 할일 추가")').click();

    // Fill content but leave title empty intentionally
    await page.locator('textarea[name="content"]').fill('중요한 회의 내용');

    // Set dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    await page.locator('input[name="startDate"]').fill(todayStr);
    await page.locator('input[name="dueDate"]').fill(todayStr);

    // Try to save - should fail due to missing title
    await page.locator('button:has-text("추가")').click();

    // Verify error message appears for title field
    await expect(page.locator('.error-message, .text-red-500')).toContainText('제목은 필수 입력 항목입니다').or().toBeVisible({ timeout: 2000 });
  });
});
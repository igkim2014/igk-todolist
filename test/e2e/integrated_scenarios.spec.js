import { test, expect } from '@playwright/test';

test.describe('igk-TodoList 통합 테스트', () => {
    // 사용자 로그인 정보
    const timestamp = Date.now();
    const user = {
        email: `test${timestamp}@test.com`,
        password: 'test1234',
        registered: false
    };

    test.beforeAll(async ({ browser }) => {
        // 테스트 시작 전에 한 번만 회원가입
        const context = await browser.newContext();
        const page = await context.newPage();

        console.log(`Registering user ${user.email}...`);
        await page.goto('/register');
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="username"]', user.email.split('@')[0]);
        await page.fill('input[name="password"]', user.password);
        await page.fill('input[name="confirmPassword"]', user.password);
        await page.getByRole('button', { name: /회원가입/i }).click();

        // 회원가입 완료 대기
        await page.waitForTimeout(2000);

        await context.close();
        user.registered = true;
        console.log('User registration completed.');
    });

    test.beforeEach(async ({ page }) => {
        // 모든 테스트 전에 로그인
        console.log(`Logging in as ${user.email}...`);
        await page.goto('/login');
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
        await page.getByRole('button', { name: /로그인/i }).click();

        // 로그인 성공 확인
        await expect(page.getByText('할일 목록')).toBeVisible({ timeout: 10000 });
        console.log('Login successful.');
    });

    test('시나리오 2.1.1: 할일 추가', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const todoTitle = `팀장님께 보고서 제출 ${Date.now()}`;

        // '새 할일 추가' 버튼 클릭
        await page.getByRole('button', { name: /새 할일 추가/i }).click();

        // 할일 정보 입력
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', "오전 11시까지 제출 필요");
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);

        // 저장
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 추가된 할일 확인
        await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test('시나리오 2.1.2: 할일 완료 처리', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const todoTitle = `완료테스트 ${Date.now()}`;

        // 먼저 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', "테스트 내용");
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 할일 완료 처리
        // 할일 항목을 더 구체적으로 찾기 (border rounded-lg p-4 클래스를 가진 div)
        const todoItem = page.locator('div.border.rounded-lg.p-4').filter({ hasText: todoTitle });

        // 체크 아이콘 버튼 클릭 (할일 항목 내 첫 번째 버튼)
        await todoItem.locator('button').first().click();

        // 완료 상태 확인 - "완료" 뱃지가 표시됨 (Badge 컴포넌트)
        await expect(todoItem.locator('.bg-green-100.text-green-800').getByText('완료')).toBeVisible();
    });

    test('시나리오 2.1.3: 할일 삭제', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const todoTitle = `삭제테스트 ${Date.now()}`;

        // 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', "삭제할 항목");
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 할일 삭제
        const todoItem = page.locator('div.border.rounded-lg.p-4').filter({ hasText: todoTitle });
        await todoItem.getByRole('button', { name: /삭제/i }).click();

        // 삭제 후 할일이 목록에서 사라지는지 확인
        await expect(page.getByText(todoTitle)).not.toBeVisible();
    });

    test('시나리오 2.1.4: 국경일 조회', async ({ page }) => {
        // 국경일 메뉴 클릭
        await page.getByRole('button', { name: /국경일/i }).click();
        await expect(page).toHaveURL(/.*\/holidays/);

        // 국경일 페이지 헤더 확인 (Exact match to avoid ambiguity)
        await expect(page.getByRole('heading', { name: '국경일', exact: true })).toBeVisible();
    });

    test('시나리오 3.2.1: 상세 정보 포함 할일 추가', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);
        const dueDateStr = dueDate.toISOString().split('T')[0];

        const todoTitle = `Q4 프로젝트 최종 보고서 ${Date.now()}`;
        const todoContent = `- 경영진 발표 자료 포함
- 예산 집행 현황 첨부
- 팀장 검토 완료 필요`;

        // 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', todoContent);
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', dueDateStr);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();

        // 추가 확인
        await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test('시나리오 3.2.2: 할일 수정', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const todoTitle = `수정테스트 ${Date.now()}`;

        // 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('textarea[name="content"]', "초기 내용");
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 할일 수정
        const todoItem = page.locator('div.border.rounded-lg.p-4').filter({ hasText: todoTitle });
        await todoItem.getByRole('button', { name: /수정/i }).click();

        // 내용 변경
        await page.fill('textarea[name="content"]', "수정된 내용 - 시험 범위: 1-10장");

        // 모달 내부의 "저장" 버튼 클릭 (수정 모드에서는 버튼 텍스트가 "저장"임)
        await page.getByRole('button', { name: '저장' }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();

        // 수정 확인
        await expect(page.getByText("수정된 내용")).toBeVisible();
    });

    test('시나리오: 할일 검색', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const searchKeyword = `검색키워드${Date.now()}`;
        const todoTitle = `${searchKeyword} 테스트 할일`;

        // 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 검색 수행
        await page.fill('input[placeholder="할일 검색..."]', searchKeyword);
        await page.getByRole('button', { name: /검색/i }).click();

        // 검색 결과 확인
        await expect(page.getByText(todoTitle)).toBeVisible();
    });

    test('시나리오: 필터 기능 - 완료된 할일', async ({ page }) => {
        const today = new Date().toISOString().split('T')[0];
        const todoTitle = `필터테스트 ${Date.now()}`;

        // 할일 추가
        await page.getByRole('button', { name: /새 할일 추가/i }).click();
        await page.fill('input[name="title"]', todoTitle);
        await page.fill('input[name="startDate"]', today);
        await page.fill('input[name="dueDate"]', today);
        await page.getByRole('button', { name: '추가', exact: true }).click();

        // 모달이 닫힐 때까지 대기
        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText(todoTitle)).toBeVisible();

        // 완료 처리
        const todoItem = page.locator('div.border.rounded-lg.p-4').filter({ hasText: todoTitle });
        // 체크 아이콘 버튼 클릭 (할일 항목 내 첫 번째 버튼)
        await todoItem.locator('button').first().click();

        // '완료' 필터 클릭
        await page.getByRole('button', { name: /완료/i }).first().click();

        // 완료된 할일이 보이는지 확인
        await expect(page.getByText(todoTitle)).toBeVisible();

        // '진행 중' 필터 클릭
        await page.getByRole('button', { name: /진행 중/i }).click();

        // 완료된 할일이 보이지 않는지 확인
        await expect(page.getByText(todoTitle)).not.toBeVisible();
    });
});

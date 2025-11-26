@echo off
chcp 65001 > nul
echo ======================================
echo Phase 3: 프론트엔드 개발 (주요 Task)
echo ======================================
echo.

REM Phase 3 - Task 3.1
echo [생성 중] Task 3.1: 프론트엔드 프로젝트 초기화
gh issue create ^
  --title "[Phase 3] Task 3.1: 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)" ^
  --label "frontend,setup,complexity: low,priority: p0" ^
  --body "## Todo%0A%0AReact 프론트엔드 프로젝트 초기 설정%0A%0A### 작업 내용%0A%0A- `npm create vite@latest frontend -- --template react` 실행%0A- Tailwind CSS 설치 및 설정%0A- 필수 패키지 설치:%0A  - `react-router-dom` (라우팅)%0A  - `zustand` (상태 관리)%0A  - `axios` (HTTP 클라이언트)%0A  - `react-hook-form` (폼 관리)%0A  - `zod` (스키마 검증)%0A  - `date-fns` (날짜 처리)%0A  - `lucide-react` (아이콘)%0A- `tailwind.config.js` 설정 (색상, 폰트)%0A- `.env` 파일 생성 (`VITE_API_BASE_URL`)%0A%0A## 완료 조건%0A%0A- [ ] Vite 프로젝트 생성 완료%0A- [ ] Tailwind CSS 설정 완료%0A- [ ] 필수 패키지 7개 설치 완료%0A- [ ] `.env` 파일 작성%0A- [ ] 개발 서버 실행 확인 (`npm run dev`)%0A%0A## 기술적 고려사항%0A%0A**기술 스택:**%0A- React 18%0A- Vite (빌드 도구)%0A- Tailwind CSS%0A%0A**환경 변수 (.env):**%0A```%0AVITE_API_BASE_URL=http://localhost:3000/api%0A```%0A%0A**Tailwind 색상:**%0A- Primary: #00C73C (네이버 그린)%0A- 진행 중: #FF7043 (주황)%0A- 완료: #66BB6A (초록)%0A- 국경일: #E53935 (빨강)%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- 없음 (독립 작업, 백엔드와 병렬 가능)%0A%0A**Blocks (후행 작업):**%0A- Task 3.2: 디렉토리 구조 생성%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.2-3.4 (통합)
echo [생성 중] Task 3.2-3.4: 디렉토리 구조, 상수, 유틸리티
gh issue create ^
  --title "[Phase 3] Task 3.2-3.4: 디렉토리 구조, Axios, 유틸리티 설정" ^
  --label "frontend,setup,complexity: low,priority: p0" ^
  --body "## Todo%0A%0A프론트엔드 프로젝트 구조 및 기본 설정%0A%0A### 작업 내용%0A%0A**Task 3.2: 디렉토리 구조**%0A- `src/components/` (공통, todo, holiday, layout)%0A- `src/pages/`%0A- `src/stores/`%0A- `src/services/`%0A- `src/hooks/`%0A- `src/utils/`%0A- `src/constants/`%0A%0A**Task 3.3: Axios 인스턴스 설정**%0A- `src/constants/apiEndpoints.js` 작성%0A- `src/constants/todoStatus.js` 작성%0A- `src/services/api.js` 작성%0A  - Axios 인스턴스 생성%0A  - 요청 인터셉터: Authorization 헤더 자동 추가%0A  - 응답 인터셉터: 401 에러 시 토큰 갱신%0A%0A**Task 3.4: 유틸리티 함수**%0A- `src/utils/dateFormatter.js` - 날짜 포맷팅%0A- `src/utils/tokenManager.js` - LocalStorage 토큰 관리%0A- `src/utils/validator.js` - 이메일, 비밀번호 검증%0A%0A## 완료 조건%0A%0A- [ ] 7개 디렉토리 생성%0A- [ ] Axios 인스턴스 설정 완료%0A- [ ] 인터셉터 동작 확인%0A- [ ] 유틸리티 함수 3개 작성%0A- [ ] 토큰 저장/조회 동작 확인%0A%0A## 기술적 고려사항%0A%0A**Axios 설정:**%0A```javascript%0Aconst api = axios.create({%0A  baseURL: import.meta.env.VITE_API_BASE_URL%0A});%0A%0Aapi.interceptors.request.use((config) => {%0A  const token = getAccessToken();%0A  if (token) {%0A    config.headers.Authorization = `Bearer ${token}`;%0A  }%0A  return config;%0A});%0A```%0A%0A**토큰 관리:**%0A- LocalStorage에 저장%0A- accessToken, refreshToken 분리%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.1: 프론트엔드 프로젝트 초기화%0A%0A**Blocks (후행 작업):**%0A- Task 3.5: Zustand 스토어 설정%0A%0A## 예상 소요 시간%0A%0A2.5시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.5-3.7 (통합)
echo [생성 중] Task 3.5-3.7: Zustand 스토어 및 서비스 레이어
gh issue create ^
  --title "[Phase 3] Task 3.5-3.7: Zustand 스토어 및 API 서비스 레이어" ^
  --label "frontend,state-management,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A상태 관리 및 API 서비스 레이어 구현%0A%0A### 작업 내용%0A%0A**Task 3.5: authStore**%0A- `src/stores/authStore.js` 작성%0A  - State: user, isAuthenticated, isLoading, error%0A  - Actions: login, register, logout, refreshToken%0A%0A**Task 3.6: API 서비스**%0A- `src/services/authService.js` - 인증 API%0A- `src/services/todoService.js` - 할일 API%0A- `src/services/holidayService.js` - 국경일 API%0A- `src/services/userService.js` - 사용자 API%0A%0A**Task 3.7: 추가 스토어**%0A- `src/stores/todoStore.js`%0A  - State: todos, isLoading, error, filters%0A  - Actions: fetchTodos, createTodo, updateTodo, deleteTodo%0A- `src/stores/holidayStore.js`%0A  - State: holidays, isLoading%0A  - Actions: fetchHolidays%0A- `src/stores/uiStore.js`%0A  - State: isModalOpen, modalType, isDarkMode%0A  - Actions: openModal, closeModal, toggleDarkMode%0A%0A## 완료 조건%0A%0A- [ ] authStore 작성 완료%0A- [ ] 4개 서비스 파일 작성 완료%0A- [ ] todoStore, holidayStore, uiStore 작성 완료%0A- [ ] 상태 업데이트 동작 확인%0A- [ ] API 호출 동작 확인%0A%0A## 기술적 고려사항%0A%0A**Zustand Store 예시:**%0A```javascript%0Aimport { create } from 'zustand';%0A%0Aconst useAuthStore = create((set) => ({%0A  user: null,%0A  isAuthenticated: false,%0A  login: async (email, password) => {%0A    const response = await authService.login(email, password);%0A    set({ user: response.user, isAuthenticated: true });%0A  }%0A}));%0A```%0A%0A**서비스 레이어:**%0A- Axios 인스턴스 사용%0A- 에러 핸들링%0A- API 엔드포인트 상수 사용%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.2-3.4: Axios, 유틸리티 설정%0A%0A**Blocks (후행 작업):**%0A- Task 3.8: 공통 컴포넌트 구현%0A- Task 3.11: 인증 화면 구현%0A%0A## 예상 소요 시간%0A%0A5.5시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.8-3.10 (통합)
echo [생성 중] Task 3.8-3.10: 공통 컴포넌트 및 라우팅
gh issue create ^
  --title "[Phase 3] Task 3.8-3.10: 공통 컴포넌트, 라우팅, 레이아웃" ^
  --label "frontend,components,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A재사용 가능한 컴포넌트 및 레이아웃 구현%0A%0A### 작업 내용%0A%0A**Task 3.8: 공통 컴포넌트**%0A- `src/components/common/Button.jsx`%0A  - variants: primary, secondary, danger%0A  - sizes: sm, md, lg%0A  - 로딩 상태 지원%0A- `src/components/common/Input.jsx`%0A  - types: text, email, password, date%0A  - 에러 상태 표시%0A- `src/components/common/Modal.jsx`%0A  - 오버레이, 닫기 버튼%0A- `src/components/common/Loading.jsx`%0A%0A**Task 3.9: 라우팅**%0A- `src/routes.jsx` 작성%0A- Protected Route 구현%0A- 라우트:%0A  - `/login`, `/register`%0A  - `/` (TodoListPage)%0A  - `/trash`, `/holidays`, `/profile`%0A%0A**Task 3.10: 레이아웃**%0A- `src/components/layout/Header.jsx`%0A  - 로고, 네비게이션, 로그아웃%0A- `src/components/layout/MainLayout.jsx`%0A  - Header + 콘텐츠 영역%0A%0A## 완료 조건%0A%0A- [ ] 4개 공통 컴포넌트 작성 완료%0A- [ ] 6개 라우트 정의 완료%0A- [ ] Protected Route 동작 확인%0A- [ ] Header, MainLayout 작성 완료%0A- [ ] 반응형 디자인 적용%0A%0A## 기술적 고려사항%0A%0A**Tailwind 스타일링:**%0A- 재사용 가능한 className%0A- 반응형 유틸리티 (sm:, md:, lg:)%0A%0A**Protected Route:**%0A```jsx%0Aconst ProtectedRoute = ({ children }) => {%0A  const { isAuthenticated } = useAuthStore();%0A  return isAuthenticated ? children : <Navigate to=\"/login\" />;%0A};%0A```%0A%0A**라우트 구조:**%0A- 공개: /login, /register%0A- 보호: /, /trash, /holidays, /profile%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.5-3.7: Zustand 스토어%0A%0A**Blocks (후행 작업):**%0A- Task 3.11: 인증 화면 구현%0A- Task 3.12: 할일 컴포넌트 구현%0A%0A## 예상 소요 시간%0A%0A6.5시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.11
echo [생성 중] Task 3.11: 인증 화면 구현
gh issue create ^
  --title "[Phase 3] Task 3.11: 인증 화면 구현 (로그인, 회원가입)" ^
  --label "frontend,feature,authentication,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A사용자 인증 화면 구현%0A%0A### 작업 내용%0A%0A**LoginPage:**%0A- `src/pages/LoginPage.jsx` 작성%0A- 이메일, 비밀번호 입력 필드%0A- 로그인 버튼, 회원가입 링크%0A- React Hook Form + Zod 검증%0A- authStore 연동%0A- 로그인 성공 시 `/` 이동%0A%0A**RegisterPage:**%0A- `src/pages/RegisterPage.jsx` 작성%0A- 이메일, 비밀번호, 사용자 이름 입력%0A- 회원가입 버튼, 로그인 링크%0A- React Hook Form + Zod 검증%0A- authStore 연동%0A- 회원가입 성공 시 `/login` 이동%0A%0A## 완료 조건%0A%0A- [ ] 로그인 페이지 작성 완료%0A- [ ] 회원가입 페이지 작성 완료%0A- [ ] 폼 검증 동작 확인%0A- [ ] API 연동 확인%0A- [ ] 에러 메시지 표시 확인%0A- [ ] 페이지 전환 확인%0A%0A## 기술적 고려사항%0A%0A**React Hook Form + Zod:**%0A```javascript%0Aconst loginSchema = z.object({%0A  email: z.string().email('유효한 이메일을 입력하세요'),%0A  password: z.string().min(8, '비밀번호는 최소 8자입니다')%0A});%0A%0Aconst { register, handleSubmit, formState: { errors } } = useForm({%0A  resolver: zodResolver(loginSchema)%0A});%0A```%0A%0A**검증 규칙:**%0A- 이메일: 형식 검증%0A- 비밀번호: 최소 8자%0A- 사용자 이름: 필수 입력%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.5-3.7: authStore%0A- Task 3.8-3.10: 공통 컴포넌트%0A%0A**Blocks (후행 작업):**%0A- Task 3.13: 할일 목록 페이지%0A%0A## 예상 소요 시간%0A%0A3시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.12-3.14 (통합)
echo [생성 중] Task 3.12-3.14: 할일 관련 컴포넌트 및 페이지
gh issue create ^
  --title "[Phase 3] Task 3.12-3.14: 할일 컴포넌트, 목록 페이지, 추가/수정 모달" ^
  --label "frontend,feature,complexity: high,priority: p0" ^
  --body "## Todo%0A%0A할일 관리 핵심 UI 구현%0A%0A### 작업 내용%0A%0A**Task 3.12: 할일 컴포넌트**%0A- `src/components/todo/TodoCard.jsx`%0A  - 제목, 내용, 날짜 표시%0A  - 완료 체크박스%0A  - 수정, 삭제 버튼%0A  - 상태별 색상 (진행 중: 주황, 완료: 초록)%0A- `src/components/todo/TodoList.jsx`%0A  - TodoCard 목록 렌더링%0A- `src/components/todo/TodoFilter.jsx`%0A  - 상태 필터, 정렬, 검색%0A%0A**Task 3.13: 할일 목록 페이지**%0A- `src/pages/TodoListPage.jsx` 작성%0A- TodoFilter, TodoList 배치%0A- 할일 추가 버튼 (FAB)%0A- todoStore 연동%0A- 로딩/에러 상태 표시%0A%0A**Task 3.14: 할일 추가/수정 모달**%0A- `src/components/todo/TodoForm.jsx` 작성%0A- 제목, 내용, 시작일, 만료일 입력%0A- React Hook Form + Zod 검증%0A- 날짜 검증 (만료일 >= 시작일)%0A- 추가/수정 모드 지원%0A%0A## 완료 조건%0A%0A- [ ] TodoCard, TodoList, TodoFilter 작성 완료%0A- [ ] 할일 목록 페이지 작성 완료%0A- [ ] TodoForm 모달 작성 완료%0A- [ ] API 연동 확인%0A- [ ] 필터링/검색 동작 확인%0A- [ ] 날짜 검증 동작 확인%0A%0A## 기술적 고려사항%0A%0A**상태별 색상:**%0A- 진행 중 (active): bg-orange-100 border-orange-400%0A- 완료 (completed): bg-green-100 border-green-400%0A- 삭제 (deleted): bg-gray-100 border-gray-400%0A%0A**날짜 검증:**%0A```javascript%0Aconst todoSchema = z.object({%0A  title: z.string().min(1, '제목을 입력하세요'),%0A  dueDate: z.date(),%0A  startDate: z.date()%0A}).refine((data) => data.dueDate >= data.startDate, {%0A  message: '만료일은 시작일 이후여야 합니다'%0A});%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.5-3.7: todoStore%0A- Task 3.8-3.10: 공통 컴포넌트%0A%0A**Blocks (후행 작업):**%0A- Task 3.15: 휴지통 페이지%0A%0A## 예상 소요 시간%0A%0A10시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 3 - Task 3.15-3.17 (통합)
echo [생성 중] Task 3.15-3.17: 휴지통, 국경일, 프로필 페이지
gh issue create ^
  --title "[Phase 3] Task 3.15-3.17: 휴지통, 국경일, 프로필 페이지" ^
  --label "frontend,feature,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A부가 기능 페이지 구현%0A%0A### 작업 내용%0A%0A**Task 3.15: 휴지통 페이지**%0A- `src/pages/TrashPage.jsx` 작성%0A- 삭제된 할일 목록 표시%0A- 복원 버튼, 영구 삭제 버튼%0A- todoStore 연동%0A%0A**Task 3.16: 국경일 페이지**%0A- `src/components/holiday/HolidayCard.jsx`%0A  - 국경일 이름, 날짜, 설명%0A  - 빨간색 테마%0A- `src/pages/HolidayPage.jsx`%0A  - HolidayCard 목록 렌더링%0A  - 연도/월 필터%0A  - holidayStore 연동%0A%0A**Task 3.17: 프로필 페이지 (P1)**%0A- `src/pages/ProfilePage.jsx` 작성%0A- 사용자 정보 표시 (이메일, 이름, 가입일)%0A- 사용자 이름 수정%0A- 비밀번호 변경%0A%0A## 완료 조건%0A%0A- [ ] 휴지통 페이지 작성 완료%0A- [ ] 복원/영구 삭제 동작 확인%0A- [ ] HolidayCard, HolidayPage 작성 완료%0A- [ ] 연도/월 필터 동작 확인%0A- [ ] 프로필 페이지 작성 완료 (P1)%0A- [ ] 정보 수정 동작 확인%0A%0A## 기술적 고려사항%0A%0A**휴지통:**%0A- status='deleted' 필터링%0A- deletedAt 날짜 표시%0A- 복원/영구 삭제 확인 다이얼로그%0A%0A**국경일:**%0A- 빨간색 테마 (bg-red-50, border-red-400)%0A- 날짜 정렬 (ASC)%0A- 매년 반복 여부 표시%0A%0A**프로필:**%0A- 읽기 전용: 이메일, 가입일%0A- 수정 가능: 사용자 이름, 비밀번호%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 3.5-3.7: todoStore, holidayStore%0A- Task 3.12-3.14: TodoCard 컴포넌트%0A%0A**Blocks (후행 작업):**%0A- Task 3.18: 반응형 디자인%0A%0A## 예상 소요 시간%0A%0A6시간 (통합)%0A%0A## 우선순위%0A%0AP0 (휴지통, 국경일), P1 (프로필)"

echo.

REM Phase 3 - Task 3.18-3.20 (통합)
echo [생성 중] Task 3.18-3.20: 반응형, 다크모드, 통합 테스트
gh issue create ^
  --title "[Phase 3] Task 3.18-3.20: 반응형 디자인, 다크모드, 통합 테스트" ^
  --label "frontend,styling,testing,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A프론트엔드 최종 마무리 및 테스트%0A%0A### 작업 내용%0A%0A**Task 3.18: 반응형 디자인**%0A- Tailwind CSS 브레이크포인트 활용%0A- 모바일 (< 768px) 최적화%0A  - 햄버거 메뉴%0A  - 할일 카드 스택 레이아웃%0A  - 터치 친화적 버튼 (44x44px 이상)%0A- 태블릿/데스크톱 (>= 768px) 레이아웃%0A%0A**Task 3.19: 다크모드 (P1)**%0A- Tailwind CSS `dark:` 유틸리티 사용%0A- uiStore에 isDarkMode 상태%0A- LocalStorage 저장%0A- 시스템 설정 감지%0A- Header에 다크모드 토글%0A%0A**Task 3.20: 통합 테스트**%0A- 전체 사용자 플로우 테스트%0A- 회원가입 → 로그인 → 할일 CRUD → 휴지통 → 국경일 → 프로필%0A- 버그 수정%0A- 성능 확인 (React DevTools)%0A%0A## 완료 조건%0A%0A- [ ] 모든 페이지 반응형 동작 확인%0A- [ ] 모바일 화면 사용 가능%0A- [ ] 다크모드 토글 동작 확인 (P1)%0A- [ ] 전체 플로우 정상 동작%0A- [ ] 발견된 버그 수정 완료%0A%0A## 기술적 고려사항%0A%0A**반응형 브레이크포인트:**%0A```javascript%0A// tailwind.config.js%0Atheme: {%0A  screens: {%0A    sm: '480px',%0A    md: '768px',%0A    lg: '1024px',%0A    xl: '1440px'%0A  }%0A}%0A```%0A%0A**다크모드:**%0A```css%0A/* Tailwind 클래스 */%0Abg-white dark:bg-gray-800%0Atext-gray-900 dark:text-gray-100%0A```%0A%0A**테스트 항목:**%0A- 회원가입/로그인%0A- 할일 생성/수정/완료/삭제%0A- 휴지통 복원/영구 삭제%0A- 국경일 조회%0A- 프로필 수정%0A- 반응형 동작%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Phase 3의 모든 Task%0A%0A**Blocks (후행 작업):**%0A- Phase 4: 통합 및 배포%0A%0A## 예상 소요 시간%0A%0A7시간 (통합)%0A%0A## 우선순위%0A%0AP0 (반응형, 테스트), P1 (다크모드)"

echo.

echo ======================================
echo Phase 3 이슈 생성 완료
echo ======================================
echo.
echo Phase 3의 8개 이슈가 생성되었습니다.
echo (일부 Task는 통합하여 생성됨)
echo.
pause

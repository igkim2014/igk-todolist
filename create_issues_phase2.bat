@echo off
chcp 65001 > nul
echo ======================================
echo Phase 2: 백엔드 개발 (14개 Task)
echo ======================================
echo.

REM Phase 2 - Task 2.1
echo [생성 중] Task 2.1: 백엔드 프로젝트 초기화
gh issue create ^
  --title "[Phase 2] Task 2.1: 백엔드 프로젝트 초기화" ^
  --label "backend,setup,complexity: low,priority: p0" ^
  --body "## Todo%0A%0ANode.js 백엔드 프로젝트 초기 설정%0A%0A### 작업 내용%0A%0A- `backend/` 디렉토리 생성%0A- `npm init -y` 실행%0A- 필수 패키지 설치:%0A  - `express` (4.x)%0A  - `pg` (node-postgres)%0A  - `jsonwebtoken` (JWT)%0A  - `bcrypt` (비밀번호 해싱)%0A  - `express-validator` (검증)%0A  - `cors` (CORS 설정)%0A  - `helmet` (보안 헤더)%0A  - `express-rate-limit` (Rate Limiting)%0A  - `dotenv` (환경 변수)%0A- `package.json` 스크립트 설정 (`dev`, `start`)%0A- `.env` 파일 생성 및 설정%0A%0A## 완료 조건%0A%0A- [ ] `package.json` 생성 완료%0A- [ ] 필수 패키지 8개 설치 완료%0A- [ ] `.env` 파일 작성 (DATABASE_URL, JWT_SECRET 등)%0A- [ ] `.env.example` 파일 생성%0A- [ ] `.gitignore` 설정 (node_modules, .env)%0A%0A## 기술적 고려사항%0A%0A**기술 스택:**%0A- Node.js 18+%0A- Express.js 4.x%0A- PostgreSQL Driver (pg)%0A%0A**환경 변수 (.env):**%0A```%0ADATABASE_URL=postgresql://localhost:5432/igk_todolist_dev%0AJWT_SECRET=your-secret-key%0AJWT_ACCESS_EXPIRATION=15m%0AJWT_REFRESH_EXPIRATION=7d%0ANODE_ENV=development%0APORT=3000%0A```%0A%0A**package.json scripts:**%0A```json%0A\"scripts\": {%0A  \"dev\": \"nodemon src/server.js\",%0A  \"start\": \"node src/server.js\"%0A}%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 1.3: 스키마 실행 및 검증%0A%0A**Blocks (후행 작업):**%0A- Task 2.2: 디렉토리 구조 생성%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.2
echo [생성 중] Task 2.2: 디렉토리 구조 생성
gh issue create ^
  --title "[Phase 2] Task 2.2: 디렉토리 구조 생성" ^
  --label "backend,setup,complexity: low,priority: p0" ^
  --body "## Todo%0A%0A백엔드 프로젝트 디렉토리 구조 설정%0A%0A### 작업 내용%0A%0A- 프로젝트 구조 설계 원칙에 따라 폴더 생성%0A- `src/controllers/` (컨트롤러)%0A- `src/services/` (비즈니스 로직)%0A- `src/routes/` (라우트)%0A- `src/middlewares/` (미들웨어)%0A- `src/config/` (설정)%0A- `src/utils/` (유틸리티)%0A- `src/app.js` (Express 앱)%0A- `src/server.js` (서버 진입점)%0A%0A## 완료 조건%0A%0A- [ ] 7개 디렉토리 생성%0A- [ ] 기본 파일 생성 (`app.js`, `server.js`)%0A- [ ] 디렉토리 구조가 설계 원칙과 일치%0A%0A## 기술적 고려사항%0A%0A**디렉토리 구조:**%0A```%0Abackend/%0A├── src/%0A│   ├── controllers/    # 요청 처리%0A│   ├── services/        # 비즈니스 로직%0A│   ├── routes/          # 라우팅%0A│   ├── middlewares/     # 미들웨어%0A│   ├── config/          # 설정 파일%0A│   ├── utils/           # 유틸리티%0A│   ├── app.js           # Express 앱 설정%0A│   └── server.js        # 서버 시작점%0A├── .env%0A├── .env.example%0A├── .gitignore%0A└── package.json%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.1: 백엔드 프로젝트 초기화%0A%0A**Blocks (후행 작업):**%0A- Task 2.3: 데이터베이스 연결 설정%0A- Task 2.4: JWT 유틸리티 작성%0A%0A## 예상 소요 시간%0A%0A0.5시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.3
echo [생성 중] Task 2.3: 데이터베이스 연결 설정
gh issue create ^
  --title "[Phase 2] Task 2.3: 데이터베이스 연결 설정" ^
  --label "backend,database,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0APostgreSQL 연결 풀 설정 및 연결 테스트%0A%0A### 작업 내용%0A%0A- `src/config/database.js` 작성%0A- `pg.Pool` 설정 (Connection Pool)%0A- 연결 문자열 환경 변수로 관리%0A- 연결 테스트 함수 작성 (`testConnection()`)%0A- 에러 핸들링 추가%0A%0A## 완료 조건%0A%0A- [ ] `database.js` 작성 완료%0A- [ ] Connection Pool 설정 (max: 10)%0A- [ ] 연결 테스트 성공%0A- [ ] 에러 로그 출력 확인%0A%0A## 기술적 고려사항%0A%0A**기술 스택:**%0A- node-postgres (pg)%0A- Connection Pooling%0A%0A**구현 예시:**%0A```javascript%0Aconst { Pool } = require('pg');%0A%0Aconst pool = new Pool({%0A  connectionString: process.env.DATABASE_URL,%0A  max: 10%0A});%0A%0Aconst testConnection = async () => {%0A  try {%0A    const client = await pool.connect();%0A    console.log('데이터베이스 연결 성공');%0A    client.release();%0A  } catch (error) {%0A    console.error('데이터베이스 연결 실패:', error);%0A  }%0A};%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.2: 디렉토리 구조 생성%0A- Task 1.3: 스키마 실행 및 검증%0A%0A**Blocks (후행 작업):**%0A- Task 2.8: 인증 API 구현%0A- Task 2.9: 할일 CRUD API 구현%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM 간소화를 위해 주요 Task만 생성하고 나머지는 요약
echo [생성 중] Task 2.4-2.7: 유틸리티 및 미들웨어 (통합)
gh issue create ^
  --title "[Phase 2] Task 2.4-2.7: 유틸리티 및 미들웨어 작성" ^
  --label "backend,middleware,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0AJWT, 비밀번호, 인증, 에러 핸들링 유틸리티 및 미들웨어 작성%0A%0A### 작업 내용%0A%0A**Task 2.4: JWT 유틸리티**%0A- `src/utils/jwtHelper.js` 작성%0A- `generateAccessToken(payload)` - 15분 만료%0A- `generateRefreshToken(payload)` - 7일 만료%0A- `verifyAccessToken(token)`%0A- `verifyRefreshToken(token)`%0A%0A**Task 2.5: 비밀번호 해싱**%0A- `src/utils/passwordHelper.js` 작성%0A- `hashPassword(plainPassword)` - bcrypt, salt rounds: 10%0A- `comparePassword(plainPassword, hashedPassword)`%0A%0A**Task 2.6: 인증 미들웨어**%0A- `src/middlewares/authMiddleware.js` 작성%0A- `authenticate` - JWT 검증 후 req.user에 저장%0A- `requireAdmin` - 관리자 권한 확인%0A%0A**Task 2.7: 에러 핸들링**%0A- `src/middlewares/errorMiddleware.js` 작성%0A- 통일된 에러 응답 형식%0A- HTTP 상태 코드 매핑%0A%0A## 완료 조건%0A%0A- [ ] JWT 토큰 생성/검증 함수 4개 작성%0A- [ ] 비밀번호 해싱/비교 함수 2개 작성%0A- [ ] 인증 미들웨어 2개 작성 (authenticate, requireAdmin)%0A- [ ] 에러 핸들러 작성%0A- [ ] 모든 함수 테스트 성공%0A%0A## 기술적 고려사항%0A%0A**JWT 설정:**%0A- Access Token: 15분%0A- Refresh Token: 7일%0A- Algorithm: HS256%0A%0A**bcrypt 설정:**%0A- Salt rounds: 10%0A%0A**에러 응답 형식:**%0A```json%0A{%0A  \"success\": false,%0A  \"error\": {%0A    \"code\": \"ERROR_CODE\",%0A    \"message\": \"에러 메시지\"%0A  }%0A}%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.2: 디렉토리 구조 생성%0A%0A**Blocks (후행 작업):**%0A- Task 2.8: 인증 API 구현%0A%0A## 예상 소요 시간%0A%0A3.5시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.8
echo [생성 중] Task 2.8: 인증 API 구현
gh issue create ^
  --title "[Phase 2] Task 2.8: 인증 API 구현 (회원가입, 로그인, 토큰 갱신)" ^
  --label "backend,feature,authentication,complexity: high,priority: p0" ^
  --body "## Todo%0A%0A사용자 인증 관련 API 엔드포인트 구현%0A%0A### 작업 내용%0A%0A**Service Layer:**%0A- `src/services/authService.js` 작성%0A  - `register(email, password, username)` - 회원가입%0A  - `login(email, password)` - 로그인%0A  - `refreshAccessToken(refreshToken)` - 토큰 갱신%0A%0A**Controller Layer:**%0A- `src/controllers/authController.js` 작성%0A  - `POST /api/auth/register`%0A  - `POST /api/auth/login`%0A  - `POST /api/auth/refresh`%0A  - `POST /api/auth/logout`%0A%0A**Routes:**%0A- `src/routes/authRoutes.js` 작성%0A- 입력 검증 (express-validator)%0A%0A## 완료 조건%0A%0A- [ ] 회원가입 API 동작 확인 (이메일 중복 체크)%0A- [ ] 로그인 API 동작 확인 (Access + Refresh Token 발급)%0A- [ ] 토큰 갱신 API 동작 확인%0A- [ ] 비밀번호 bcrypt 해싱 확인%0A- [ ] 에러 응답 확인 (400, 401, 409)%0A%0A## 기술적 고려사항%0A%0A**API 엔드포인트:**%0A- POST /api/auth/register%0A- POST /api/auth/login%0A- POST /api/auth/refresh%0A- POST /api/auth/logout%0A%0A**검증 규칙:**%0A- 이메일: 형식 검증, 중복 체크%0A- 비밀번호: 최소 8자%0A- 사용자 이름: 필수 입력%0A%0A**응답 형식:**%0A```json%0A{%0A  \"success\": true,%0A  \"data\": {%0A    \"accessToken\": \"jwt-token\",%0A    \"refreshToken\": \"jwt-refresh-token\",%0A    \"user\": { \"userId\": \"...\", \"email\": \"...\" }%0A  }%0A}%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.3: 데이터베이스 연결 설정%0A- Task 2.4-2.7: 유틸리티 및 미들웨어%0A%0A**Blocks (후행 작업):**%0A- Task 2.13: Express 앱 통합%0A%0A## 예상 소요 시간%0A%0A3시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.9
echo [생성 중] Task 2.9: 할일 CRUD API 구현
gh issue create ^
  --title "[Phase 2] Task 2.9: 할일 CRUD API 구현" ^
  --label "backend,feature,crud,complexity: high,priority: p0" ^
  --body "## Todo%0A%0A할일 관리 핵심 기능 API 구현%0A%0A### 작업 내용%0A%0A**Service Layer:**%0A- `src/services/todoService.js` 작성%0A  - `getTodos(userId, filters)` - 할일 목록 조회%0A  - `getTodoById(todoId, userId)` - 할일 상세 조회%0A  - `createTodo(userId, todoData)` - 할일 생성%0A  - `updateTodo(todoId, userId, updateData)` - 할일 수정%0A  - `completeTodo(todoId, userId)` - 할일 완료%0A  - `deleteTodo(todoId, userId)` - 휴지통 이동 (소프트 삭제)%0A  - `restoreTodo(todoId, userId)` - 할일 복원%0A%0A**Controller Layer:**%0A- `src/controllers/todoController.js` 작성%0A  - `GET /api/todos` (쿼리: status, search, sortBy, order)%0A  - `GET /api/todos/:id`%0A  - `POST /api/todos`%0A  - `PUT /api/todos/:id`%0A  - `PATCH /api/todos/:id/complete`%0A  - `DELETE /api/todos/:id`%0A  - `PATCH /api/todos/:id/restore`%0A%0A**Routes:**%0A- `src/routes/todoRoutes.js` 작성%0A- 비즈니스 규칙 적용 (dueDate >= startDate, 권한 체크)%0A%0A## 완료 조건%0A%0A- [ ] 7개 API 엔드포인트 동작 확인%0A- [ ] 인증 미들웨어 적용%0A- [ ] 권한 체크 (타인의 할일 접근 금지)%0A- [ ] 소프트 삭제 동작 확인 (status='deleted', deletedAt 기록)%0A- [ ] 날짜 검증 동작 확인%0A- [ ] 에러 응답 확인 (400, 403, 404)%0A%0A## 기술적 고려사항%0A%0A**API 엔드포인트:**%0A- GET /api/todos%0A- GET /api/todos/:id%0A- POST /api/todos%0A- PUT /api/todos/:id%0A- PATCH /api/todos/:id/complete%0A- DELETE /api/todos/:id%0A- PATCH /api/todos/:id/restore%0A%0A**비즈니스 규칙:**%0A- [BR-02] 사용자는 자신의 할일만 조회/수정/삭제%0A- [BR-05] 삭제 시 휴지통 이동 (소프트 삭제)%0A- [BR-08] 완료 시 isCompleted=true, status='completed'%0A- [BR-12] dueDate >= startDate%0A%0A**쿼리 필터:**%0A- status: active | completed | deleted%0A- search: 제목/내용 검색%0A- sortBy: dueDate | createdAt%0A- order: asc | desc%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.3: 데이터베이스 연결 설정%0A- Task 2.6: 인증 미들웨어%0A%0A**Blocks (후행 작업):**%0A- Task 2.10: 휴지통 API 구현%0A- Task 2.13: Express 앱 통합%0A%0A## 예상 소요 시간%0A%0A4시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.10
echo [생성 중] Task 2.10: 휴지통 API 구현
gh issue create ^
  --title "[Phase 2] Task 2.10: 휴지통 API 구현" ^
  --label "backend,feature,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A삭제된 할일 관리 API 구현%0A%0A### 작업 내용%0A%0A**Service Layer:**%0A- `src/services/trashService.js` 작성%0A  - `getTrash(userId)` - 휴지통 조회 (status='deleted')%0A  - `permanentlyDelete(todoId, userId)` - 영구 삭제%0A%0A**Controller Layer:**%0A- `src/controllers/trashController.js` 작성%0A  - `GET /api/trash`%0A  - `DELETE /api/trash/:id`%0A%0A**Routes:**%0A- `src/routes/trashRoutes.js` 작성%0A%0A## 완료 조건%0A%0A- [ ] 휴지통 조회 API 동작 확인%0A- [ ] 영구 삭제 API 동작 확인 (DB에서 완전히 제거)%0A- [ ] 권한 체크 동작 확인%0A- [ ] 에러 응답 확인 (404, 400)%0A%0A## 기술적 고려사항%0A%0A**API 엔드포인트:**%0A- GET /api/trash%0A- DELETE /api/trash/:id%0A%0A**비즈니스 규칙:**%0A- [BR-06] 휴지통의 할일은 복원 가능%0A- [BR-07] 영구 삭제 시 DB에서 완전히 제거%0A%0A**쿼리 조건:**%0A```sql%0ASELECT * FROM todos %0AWHERE user_id = $1 AND status = 'deleted'%0AORDER BY deleted_at DESC;%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.9: 할일 CRUD API 구현%0A%0A**Blocks (후행 작업):**%0A- Task 2.13: Express 앱 통합%0A%0A## 예상 소요 시간%0A%0A1.5시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.11
echo [생성 중] Task 2.11: 국경일 API 구현
gh issue create ^
  --title "[Phase 2] Task 2.11: 국경일 API 구현" ^
  --label "backend,feature,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A국경일 조회 및 관리 API 구현%0A%0A### 작업 내용%0A%0A**Service Layer:**%0A- `src/services/holidayService.js` 작성%0A  - `getHolidays(year, month)` - 국경일 조회%0A  - `createHoliday(holidayData)` - 국경일 추가 (관리자 전용)%0A  - `updateHoliday(holidayId, updateData)` - 국경일 수정 (관리자 전용)%0A%0A**Controller Layer:**%0A- `src/controllers/holidayController.js` 작성%0A  - `GET /api/holidays` (쿼리: year, month)%0A  - `POST /api/holidays` (관리자 전용)%0A  - `PUT /api/holidays/:id` (관리자 전용)%0A%0A**Routes:**%0A- `src/routes/holidayRoutes.js` 작성%0A- 관리자 권한 미들웨어 적용%0A%0A## 완료 조건%0A%0A- [ ] 국경일 조회 API 동작 확인 (인증 필요)%0A- [ ] 국경일 추가 API 동작 확인 (관리자만 가능)%0A- [ ] 국경일 수정 API 동작 확인 (관리자만 가능)%0A- [ ] 연도/월 필터링 동작 확인%0A- [ ] 에러 응답 확인 (403, 404)%0A%0A## 기술적 고려사항%0A%0A**API 엔드포인트:**%0A- GET /api/holidays?year=2025&month=1%0A- POST /api/holidays (관리자)%0A- PUT /api/holidays/:id (관리자)%0A%0A**비즈니스 규칙:**%0A- [BR-03] 모든 인증된 사용자 조회 가능%0A- [BR-04] 관리자(role='admin')만 추가/수정%0A- [BR-09] 관리자만 추가/수정 가능%0A- [BR-10] 국경일은 삭제 불가%0A- [BR-11] 매년 반복 일정 지원%0A%0A**필터링 쿼리:**%0A```sql%0ASELECT * FROM holidays%0AWHERE EXTRACT(YEAR FROM date) = $1%0A  AND EXTRACT(MONTH FROM date) = $2%0AORDER BY date ASC;%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.3: 데이터베이스 연결 설정%0A- Task 2.6: 인증 미들웨어 (requireAdmin)%0A- Task 1.4: 초기 데이터 삽입%0A%0A**Blocks (후행 작업):**%0A- Task 2.13: Express 앱 통합%0A%0A## 예상 소요 시간%0A%0A2시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 2 - Task 2.12-2.14 (통합)
echo [생성 중] Task 2.12-2.14: Rate Limiting, 앱 통합, 테스트
gh issue create ^
  --title "[Phase 2] Task 2.12-2.14: Rate Limiting, Express 앱 통합, API 테스트" ^
  --label "backend,integration,testing,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A백엔드 최종 통합 및 테스트%0A%0A### 작업 내용%0A%0A**Task 2.12: Rate Limiting**%0A- `src/middlewares/rateLimitMiddleware.js` 작성%0A- 일반 API: 100 req/min per IP%0A- 인증 API: 5 req/15min per IP%0A%0A**Task 2.13: Express 앱 통합**%0A- `src/app.js` 작성%0A  - CORS 설정%0A  - Helmet 설정 (보안 헤더)%0A  - JSON 파싱%0A  - 라우트 연결 (`/api/auth`, `/api/todos`, `/api/trash`, `/api/holidays`)%0A  - 에러 핸들러 적용%0A- `src/server.js` 작성%0A  - 포트 설정 (3000)%0A  - 서버 시작%0A%0A**Task 2.14: API 테스트**%0A- Postman 또는 Thunder Client 컬렉션 생성%0A- 모든 API 엔드포인트 테스트%0A- 회원가입 → 로그인 → 할일 생성 → 조회 → 수정 → 삭제 → 복원 → 영구 삭제%0A- 국경일 조회%0A- 성공/실패 케이스 테스트%0A%0A## 완료 조건%0A%0A- [ ] Rate Limiter 설정 완료%0A- [ ] CORS 설정 완료%0A- [ ] 4개 라우트 연결 확인%0A- [ ] 서버 실행 확인 (http://localhost:3000)%0A- [ ] 모든 API 엔드포인트 테스트 완료%0A- [ ] JWT 인증 동작 확인%0A- [ ] 권한 체크 동작 확인%0A%0A## 기술적 고려사항%0A%0A**Rate Limiting:**%0A```javascript%0Aconst rateLimit = require('express-rate-limit');%0A%0Aconst authLimiter = rateLimit({%0A  windowMs: 15 * 60 * 1000, // 15분%0A  max: 5%0A});%0A```%0A%0A**CORS 설정:**%0A```javascript%0Aapp.use(cors({%0A  origin: process.env.FRONTEND_URL || 'http://localhost:5173',%0A  credentials: true%0A}));%0A```%0A%0A**테스트 플로우:**%0A1. 회원가입 (POST /api/auth/register)%0A2. 로그인 (POST /api/auth/login)%0A3. 할일 생성 (POST /api/todos)%0A4. 할일 조회 (GET /api/todos)%0A5. 할일 완료 (PATCH /api/todos/:id/complete)%0A6. 할일 삭제 (DELETE /api/todos/:id)%0A7. 휴지통 조회 (GET /api/trash)%0A8. 할일 복원 (PATCH /api/todos/:id/restore)%0A9. 영구 삭제 (DELETE /api/trash/:id)%0A10. 국경일 조회 (GET /api/holidays)%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 2.8: 인증 API%0A- Task 2.9: 할일 API%0A- Task 2.10: 휴지통 API%0A- Task 2.11: 국경일 API%0A%0A**Blocks (후행 작업):**%0A- Phase 3: 프론트엔드 개발%0A- Task 4.1: 프론트엔드-백엔드 통합 테스트%0A%0A## 예상 소요 시간%0A%0A3.5시간 (통합)%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

echo ======================================
echo Phase 2 이슈 생성 완료
echo ======================================
echo.
echo Phase 2의 8개 이슈가 생성되었습니다.
echo (일부 Task는 통합하여 생성됨)
echo.
pause

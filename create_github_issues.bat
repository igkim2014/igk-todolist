@echo off
chcp 65001 > nul
echo ======================================
echo GitHub 이슈 생성 스크립트
echo ======================================
echo.

REM GitHub CLI 설치 확인
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub CLI가 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo 1. winget install --id GitHub.cli
    echo 또는
    echo 2. https://cli.github.com/ 에서 다운로드
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub CLI 설치 확인됨
echo.

REM 인증 확인
gh auth status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub CLI 인증이 필요합니다.
    echo.
    echo 인증 방법:
    echo gh auth login
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub CLI 인증 확인됨
echo.

REM 저장소 확인
gh repo view >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [오류] GitHub 저장소가 연결되어 있지 않습니다.
    echo 현재 디렉토리가 git 저장소인지 확인하세요.
    echo.
    pause
    exit /b 1
)

echo [확인] GitHub 저장소 연결 확인됨
echo.

echo ======================================
echo Phase 1: 데이터베이스 구축 (4개 Task)
echo ======================================
echo.

REM Phase 1 - Task 1.1
echo [생성 중] Task 1.1: 로컬 PostgreSQL 설치 및 설정
gh issue create ^
  --title "[Phase 1] Task 1.1: 로컬 PostgreSQL 설치 및 설정" ^
  --label "infrastructure,database,complexity: low,priority: p0" ^
  --body "## Todo%0A%0APostgreSQL 15+ 개발 환경 구축%0A%0A### 작업 내용%0A%0A- PostgreSQL 15+ 설치 (Windows 환경)%0A- pgAdmin 또는 DBeaver 설치 (DB 관리 도구)%0A- 로컬 PostgreSQL 서버 실행 확인%0A- 데이터베이스 생성 (`igk_todolist_dev`)%0A- 연결 테스트 (`psql` 또는 GUI 도구)%0A%0A## 완료 조건%0A%0A- [ ] PostgreSQL 서비스 실행 중%0A- [ ] `igk_todolist_dev` 데이터베이스 생성 완료%0A- [ ] 연결 문자열 확인: `postgresql://localhost:5432/igk_todolist_dev`%0A- [ ] 관리 도구로 접속 가능%0A%0A## 기술적 고려사항%0A%0A**기술 스택:**%0A- PostgreSQL 15+%0A- pgAdmin / DBeaver%0A%0A**설정 사항:**%0A- Port: 5432 (기본값)%0A- Database: igk_todolist_dev%0A- 환경 변수 준비 (DATABASE_URL)%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- 없음 (독립 작업)%0A%0A**Blocks (후행 작업):**%0A- Task 1.2: 데이터베이스 스키마 작성%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

if %ERRORLEVEL% EQU 0 (
    echo [완료] Task 1.1 이슈 생성됨
) else (
    echo [실패] Task 1.1 이슈 생성 실패
)
echo.

REM Phase 1 - Task 1.2
echo [생성 중] Task 1.2: 데이터베이스 스키마 작성
gh issue create ^
  --title "[Phase 1] Task 1.2: 데이터베이스 스키마 작성 (schema.sql)" ^
  --label "database,backend,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0Adatabase/schema.sql 파일 작성 및 테이블 정의%0A%0A### 작업 내용%0A%0A- User 테이블 정의 (userId, email, password, username, role, createdAt, updatedAt)%0A- Todo 테이블 정의 (todoId, userId, title, content, startDate, dueDate, status, isCompleted, createdAt, updatedAt, deletedAt)%0A- Holiday 테이블 정의 (holidayId, title, date, description, isRecurring, createdAt, updatedAt)%0A- UNIQUE INDEX 추가: User.email%0A- INDEX 추가: Todo(userId, status), Todo(dueDate), Holiday(date)%0A- FOREIGN KEY 설정: Todo.userId → User.userId (ON DELETE CASCADE)%0A- CHECK 제약: dueDate >= startDate%0A%0A## 완료 조건%0A%0A- [ ] `schema.sql` 파일 작성 완료%0A- [ ] UUID 기본 키 설정%0A- [ ] 인덱스 설정 완료%0A- [ ] 외래 키 제약 조건 설정%0A- [ ] CHECK 제약 조건 추가%0A%0A## 기술적 고려사항%0A%0A**파일:**%0A- `database/schema.sql`%0A%0A**테이블:**%0A- User (사용자)%0A- Todo (할일)%0A- Holiday (국경일)%0A%0A**제약 조건:**%0A- Primary Key: UUID%0A- Unique: User.email%0A- Foreign Key: Todo.userId → User.userId%0A- Check: dueDate >= startDate%0A%0A**인덱스:**%0A- User.email (unique)%0A- Todo(userId, status)%0A- Todo(dueDate)%0A- Holiday(date)%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 1.1: 로컬 PostgreSQL 설치 및 설정%0A%0A**Blocks (후행 작업):**%0A- Task 1.3: 스키마 실행 및 검증%0A%0A## 예상 소요 시간%0A%0A2시간%0A%0A## 우선순위%0A%0AP0 (필수)"

if %ERRORLEVEL% EQU 0 (
    echo [완료] Task 1.2 이슈 생성됨
) else (
    echo [실패] Task 1.2 이슈 생성 실패
)
echo.

REM Phase 1 - Task 1.3
echo [생성 중] Task 1.3: 스키마 실행 및 검증
gh issue create ^
  --title "[Phase 1] Task 1.3: 스키마 실행 및 검증" ^
  --label "database,testing,complexity: low,priority: p0" ^
  --body "## Todo%0A%0A작성된 schema.sql을 실행하고 테이블 생성 검증%0A%0A### 작업 내용%0A%0A- `schema.sql` 실행 (`psql -U postgres -d igk_todolist_dev -f schema.sql`)%0A- 테이블 생성 확인 (User, Todo, Holiday)%0A- 인덱스 생성 확인%0A- 제약 조건 테스트 (이메일 중복, 날짜 검증)%0A%0A## 완료 조건%0A%0A- [ ] 3개 테이블 생성 확인%0A- [ ] 인덱스 6개 생성 확인%0A- [ ] CHECK 제약 동작 확인 (잘못된 날짜 입력 시 에러)%0A- [ ] UNIQUE 제약 동작 확인 (이메일 중복 시 에러)%0A%0A## 기술적 고려사항%0A%0A**실행 명령:**%0A```bash%0Apsql -U postgres -d igk_todolist_dev -f database/schema.sql%0A```%0A%0A**검증 항목:**%0A- 테이블 존재 확인%0A- 컬럼 타입 확인%0A- 인덱스 생성 확인%0A- 제약 조건 테스트%0A%0A**테스트 쿼리:**%0A```sql%0A-- 테이블 목록 조회%0A\\dt%0A%0A-- 인덱스 확인%0A\\di%0A%0A-- 제약 조건 테스트%0AINSERT INTO users (email, email) VALUES ('test@test.com', 'test@test.com'); -- 중복 에러 예상%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 1.2: 데이터베이스 스키마 작성%0A%0A**Blocks (후행 작업):**%0A- Task 1.4: 초기 데이터 삽입 (국경일)%0A- Task 2.3: 데이터베이스 연결 설정%0A%0A## 예상 소요 시간%0A%0A0.5시간%0A%0A## 우선순위%0A%0AP0 (필수)"

if %ERRORLEVEL% EQU 0 (
    echo [완료] Task 1.3 이슈 생성됨
) else (
    echo [실패] Task 1.3 이슈 생성 실패
)
echo.

REM Phase 1 - Task 1.4
echo [생성 중] Task 1.4: 초기 데이터 삽입 (국경일)
gh issue create ^
  --title "[Phase 1] Task 1.4: 초기 데이터 삽입 (국경일)" ^
  --label "database,data,complexity: low,priority: p1" ^
  --body "## Todo%0A%0A2025년 주요 국경일 데이터 삽입%0A%0A### 작업 내용%0A%0A- 2025년 주요 국경일 데이터 삽입%0A- 신정(1/1), 삼일절(3/1), 어린이날(5/5), 석가탄신일(5/5), 현충일(6/6), 광복절(8/15), 추석(10/6-8), 개천절(10/3), 한글날(10/9), 크리스마스(12/25)%0A- `isRecurring=true` 설정%0A%0A## 완료 조건%0A%0A- [ ] 최소 10개 국경일 데이터 삽입%0A- [ ] Holiday 테이블 조회로 확인%0A- [ ] 날짜 정렬 확인%0A%0A## 기술적 고려사항%0A%0A**삽입 데이터:**%0A- 신정: 2025-01-01%0A- 삼일절: 2025-03-01%0A- 어린이날: 2025-05-05%0A- 석가탄신일: 2025-05-05%0A- 현충일: 2025-06-06%0A- 광복절: 2025-08-15%0A- 추석: 2025-10-06 ~ 2025-10-08%0A- 개천절: 2025-10-03%0A- 한글날: 2025-10-09%0A- 크리스마스: 2025-12-25%0A%0A**SQL 예시:**%0A```sql%0AINSERT INTO holidays (title, date, description, is_recurring)%0AVALUES %0A  ('신정', '2025-01-01', '새해 첫날', true),%0A  ('삼일절', '2025-03-01', '3·1 운동 기념일', true);%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 1.3: 스키마 실행 및 검증%0A%0A**Blocks (후행 작업):**%0A- Task 2.11: 국경일 API 구현%0A%0A## 예상 소요 시간%0A%0A0.5시간%0A%0A## 우선순위%0A%0AP1"

if %ERRORLEVEL% EQU 0 (
    echo [완료] Task 1.4 이슈 생성됨
) else (
    echo [실패] Task 1.4 이슈 생성 실패
)
echo.

echo ======================================
echo 스크립트 실행 완료
echo ======================================
echo.
echo Phase 1의 4개 이슈가 생성되었습니다.
echo 나머지 Phase는 별도로 실행하세요.
echo.
pause

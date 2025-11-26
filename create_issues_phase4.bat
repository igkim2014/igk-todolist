@echo off
chcp 65001 > nul
echo ======================================
echo Phase 4: 통합 및 배포 (7개 Task)
echo ======================================
echo.

REM Phase 4 - Task 4.1
echo [생성 중] Task 4.1: 프론트엔드-백엔드 통합 테스트
gh issue create ^
  --title "[Phase 4] Task 4.1: 프론트엔드-백엔드 통합 테스트" ^
  --label "integration,testing,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A로컬 환경에서 전체 시스템 통합 테스트%0A%0A### 작업 내용%0A%0A- 로컬 환경에서 프론트엔드와 백엔드 동시 실행%0A- CORS 설정 확인%0A- API 연동 확인%0A- JWT 인증 플로우 테스트%0A- 에러 핸들링 확인%0A%0A## 완료 조건%0A%0A- [ ] 프론트엔드에서 백엔드 API 호출 성공%0A- [ ] 인증 플로우 정상 동작%0A- [ ] CORS 문제 없음%0A- [ ] 에러 메시지 정상 표시%0A%0A## 기술적 고려사항%0A%0A**실행 환경:**%0A- 백엔드: http://localhost:3000%0A- 프론트엔드: http://localhost:5173%0A%0A**CORS 설정 확인:**%0A```javascript%0A// backend/src/app.js%0Aapp.use(cors({%0A  origin: 'http://localhost:5173',%0A  credentials: true%0A}));%0A```%0A%0A**테스트 시나리오:**%0A1. 백엔드 서버 시작 (npm run dev)%0A2. 프론트엔드 서버 시작 (npm run dev)%0A3. 회원가입 → 로그인%0A4. 할일 생성 → 조회 → 수정 → 삭제%0A5. 휴지통 복원 → 영구 삭제%0A6. 국경일 조회%0A7. 로그아웃%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Phase 2 완료 (백엔드)%0A- Phase 3 완료 (프론트엔드)%0A%0A**Blocks (후행 작업):**%0A- Task 4.2: Supabase PostgreSQL 설정%0A%0A## 예상 소요 시간%0A%0A2시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 4 - Task 4.2
echo [생성 중] Task 4.2: Supabase PostgreSQL 설정
gh issue create ^
  --title "[Phase 4] Task 4.2: Supabase PostgreSQL 설정" ^
  --label "infrastructure,database,deployment,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0ASupabase 클라우드 데이터베이스 설정%0A%0A### 작업 내용%0A%0A- Supabase 계정 생성%0A- 새 프로젝트 생성%0A- PostgreSQL 데이터베이스 확인%0A- 연결 문자열 복사%0A- 로컬 `schema.sql`을 Supabase에 실행%0A- 국경일 데이터 삽입%0A- 연결 테스트%0A%0A## 완료 조건%0A%0A- [ ] Supabase 프로젝트 생성 완료%0A- [ ] 데이터베이스 스키마 생성 완료%0A- [ ] 초기 데이터 삽입 완료%0A- [ ] 연결 문자열 확인%0A%0A## 기술적 고려사항%0A%0A**Supabase 설정:**%0A1. https://supabase.com 접속%0A2. 새 프로젝트 생성%0A3. Settings → Database → Connection string 복사%0A4. SQL Editor에서 schema.sql 실행%0A%0A**연결 문자열 형식:**%0A```%0Apostgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres%0A```%0A%0A**스키마 실행:**%0A- Supabase SQL Editor 사용%0A- 또는 psql 명령줄 도구%0A```bash%0Apsql \"postgresql://...\" -f database/schema.sql%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 1.2-1.4: 스키마 작성 및 초기 데이터%0A%0A**Blocks (후행 작업):**%0A- Task 4.3: Vercel 백엔드 배포%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 4 - Task 4.3
echo [생성 중] Task 4.3: Vercel 백엔드 배포
gh issue create ^
  --title "[Phase 4] Task 4.3: Vercel 백엔드 배포" ^
  --label "backend,deployment,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0AVercel에 백엔드 API 배포%0A%0A### 작업 내용%0A%0A- GitHub 레포지토리에 코드 푸시%0A- Vercel 계정 생성 및 연결%0A- `backend/` 디렉토리를 Serverless Functions로 배포%0A- 환경 변수 설정 (Vercel 대시보드)%0A  - `DATABASE_URL`%0A  - `JWT_SECRET`%0A  - `JWT_ACCESS_EXPIRATION`%0A  - `JWT_REFRESH_EXPIRATION`%0A  - `NODE_ENV=production`%0A- 배포 성공 확인%0A%0A## 완료 조건%0A%0A- [ ] Vercel 배포 성공%0A- [ ] 환경 변수 설정 완료%0A- [ ] API 엔드포인트 접근 가능%0A- [ ] Supabase 연결 확인%0A%0A## 기술적 고려사항%0A%0A**Vercel 배포 방법:**%0A1. https://vercel.com 접속%0A2. GitHub 레포지토리 연결%0A3. Root Directory: backend%0A4. Framework Preset: Other%0A5. Build Command: (비워둠)%0A6. Output Directory: (비워둠)%0A%0A**환경 변수 설정:**%0A- Vercel Dashboard → Settings → Environment Variables%0A- DATABASE_URL: Supabase 연결 문자열%0A- JWT_SECRET: 랜덤 문자열 (최소 32자)%0A- NODE_ENV: production%0A%0A**API 엔드포인트:**%0A```%0Ahttps://your-backend.vercel.app/api/auth/login%0Ahttps://your-backend.vercel.app/api/todos%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 4.2: Supabase PostgreSQL 설정%0A- Phase 2 완료 (백엔드 개발)%0A%0A**Blocks (후행 작업):**%0A- Task 4.4: Vercel 프론트엔드 배포%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 4 - Task 4.4
echo [생성 중] Task 4.4: Vercel 프론트엔드 배포
gh issue create ^
  --title "[Phase 4] Task 4.4: Vercel 프론트엔드 배포" ^
  --label "frontend,deployment,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0AVercel에 프론트엔드 웹 애플리케이션 배포%0A%0A### 작업 내용%0A%0A- GitHub 레포지토리에 코드 푸시 (프론트엔드)%0A- Vercel 프로젝트 생성 (frontend 디렉토리)%0A- 환경 변수 설정%0A  - `VITE_API_BASE_URL=https://your-backend.vercel.app/api`%0A- 빌드 설정 확인 (Vite)%0A- 배포 성공 확인%0A%0A## 완료 조건%0A%0A- [ ] Vercel 배포 성공%0A- [ ] 환경 변수 설정 완료%0A- [ ] 프론트엔드 접근 가능%0A- [ ] 백엔드 API 연동 확인%0A%0A## 기술적 고려사항%0A%0A**Vercel 배포 방법:**%0A1. Vercel Dashboard → New Project%0A2. GitHub 레포지토리 선택%0A3. Root Directory: frontend%0A4. Framework Preset: Vite%0A5. Build Command: npm run build%0A6. Output Directory: dist%0A%0A**환경 변수:**%0A- VITE_API_BASE_URL: 백엔드 URL%0A- 예시: https://igk-todolist-backend.vercel.app/api%0A%0A**빌드 확인:**%0A```bash%0Acd frontend%0Anpm run build%0Anpm run preview%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 4.3: Vercel 백엔드 배포%0A- Phase 3 완료 (프론트엔드 개발)%0A%0A**Blocks (후행 작업):**%0A- Task 4.5: 프로덕션 환경 테스트%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 4 - Task 4.5
echo [생성 중] Task 4.5: 프로덕션 환경 테스트
gh issue create ^
  --title "[Phase 4] Task 4.5: 프로덕션 환경 테스트" ^
  --label "testing,deployment,complexity: medium,priority: p0" ^
  --body "## Todo%0A%0A배포된 프로덕션 환경에서 전체 테스트%0A%0A### 작업 내용%0A%0A- 배포된 프론트엔드에서 전체 플로우 테스트%0A- 회원가입 → 로그인 → 할일 CRUD → 휴지통 → 국경일 조회 → 프로필 → 로그아웃%0A- 성능 확인 (Lighthouse)%0A- 보안 확인 (HTTPS, CORS, Rate Limiting)%0A- 크로스 브라우저 테스트%0A- 모바일 테스트%0A%0A## 완료 조건%0A%0A- [ ] 전체 플로우 정상 동작%0A- [ ] Lighthouse 점수 80+ (Performance, Accessibility)%0A- [ ] HTTPS 정상 동작%0A- [ ] 크로스 브라우저 정상 동작%0A- [ ] 모바일 정상 동작%0A%0A## 기술적 고려사항%0A%0A**Lighthouse 테스트:**%0A- Chrome DevTools → Lighthouse%0A- Categories: Performance, Accessibility, Best Practices, SEO%0A- 목표: 각 카테고리 80점 이상%0A%0A**크로스 브라우저 테스트:**%0A- Chrome (최신)%0A- Firefox (최신)%0A- Safari (최신)%0A- Edge (최신)%0A%0A**모바일 테스트:**%0A- Chrome DevTools Device Mode%0A- iPhone SE, iPhone 12, iPad%0A- Android (Galaxy S20)%0A%0A**보안 체크:**%0A- HTTPS 인증서 확인%0A- CORS 헤더 확인%0A- Rate Limiting 동작 확인%0A- JWT 토큰 만료 처리%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Task 4.4: Vercel 프론트엔드 배포%0A%0A**Blocks (후행 작업):**%0A- Task 4.6: 문서화 및 README 작성%0A%0A## 예상 소요 시간%0A%0A1.5시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

REM Phase 4 - Task 4.6
echo [생성 중] Task 4.6: 문서화 및 README 작성
gh issue create ^
  --title "[Phase 4] Task 4.6: 문서화 및 README 작성" ^
  --label "documentation,complexity: low,priority: p1" ^
  --body "## Todo%0A%0A프로젝트 문서 작성 및 README 완성%0A%0A### 작업 내용%0A%0A- `README.md` 작성%0A  - 프로젝트 개요%0A  - 기술 스택%0A  - 설치 및 실행 방법%0A  - 환경 변수 설정 가이드%0A  - API 문서 링크%0A  - 배포 URL%0A  - 스크린샷 (선택)%0A- `backend/README.md` 작성 (API 문서)%0A- `frontend/README.md` 작성 (컴포넌트 구조)%0A%0A## 완료 조건%0A%0A- [ ] 루트 README 작성 완료%0A- [ ] 백엔드 README 작성 완료 (선택)%0A- [ ] 프론트엔드 README 작성 완료 (선택)%0A%0A## 기술적 고려사항%0A%0A**README 구조:**%0A```markdown%0A# IGK-TodoList%0A%0A## 프로젝트 개요%0A사용자 인증 기반 할일 관리 애플리케이션%0A%0A## 기술 스택%0A- Frontend: React 18, Vite, Tailwind CSS, Zustand%0A- Backend: Node.js, Express, PostgreSQL%0A- Database: Supabase PostgreSQL%0A- Deployment: Vercel%0A%0A## 설치 및 실행%0A### 백엔드%0A```bash%0Acd backend%0Anpm install%0Acp .env.example .env%0Anpm run dev%0A```%0A%0A### 프론트엔드%0A```bash%0Acd frontend%0Anpm install%0Acp .env.example .env%0Anpm run dev%0A```%0A%0A## 배포 URL%0A- Frontend: https://...%0A- Backend: https://...%0A```%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- Phase 4의 모든 Task%0A%0A**Blocks (후행 작업):**%0A- Task 4.7: 최종 점검 및 런칭%0A%0A## 예상 소요 시간%0A%0A1시간%0A%0A## 우선순위%0A%0AP1"

echo.

REM Phase 4 - Task 4.7
echo [생성 중] Task 4.7: 최종 점검 및 런칭
gh issue create ^
  --title "[Phase 4] Task 4.7: 최종 점검 및 런칭" ^
  --label "milestone,deployment,complexity: low,priority: p0" ^
  --body "## Todo%0A%0A최종 점검 및 프로젝트 런칭%0A%0A### 작업 내용%0A%0A- 모든 Task 완료 확인%0A- 체크리스트 점검%0A- 배포 URL 공유%0A- 런칭 공지 (선택)%0A%0A## 완료 조건%0A%0A- [ ] 모든 P0 기능 동작 확인%0A- [ ] 배포 URL 확인%0A- [ ] 문서화 완료%0A%0A## 기술적 고려사항%0A%0A**최종 체크리스트:**%0A%0A### Phase 1: 데이터베이스%0A- [ ] PostgreSQL 설치 및 실행%0A- [ ] 스키마 생성 및 검증%0A- [ ] 국경일 데이터 삽입%0A%0A### Phase 2: 백엔드%0A- [ ] 인증 API 동작%0A- [ ] 할일 CRUD API 동작%0A- [ ] 휴지통 API 동작%0A- [ ] 국경일 API 동작%0A- [ ] 전체 API 테스트 완료%0A%0A### Phase 3: 프론트엔드%0A- [ ] 로그인/회원가입 동작%0A- [ ] 할일 목록 동작%0A- [ ] 할일 추가/수정 동작%0A- [ ] 휴지통 동작%0A- [ ] 국경일 조회 동작%0A- [ ] 반응형 디자인 동작%0A%0A### Phase 4: 배포%0A- [ ] Supabase DB 연결%0A- [ ] Vercel 백엔드 배포%0A- [ ] Vercel 프론트엔드 배포%0A- [ ] 프로덕션 테스트 완료%0A- [ ] 문서화 완료%0A%0A## 성공 기준%0A%0A**기술적 성공 기준:**%0A- [ ] 모든 P0 기능 정상 동작%0A- [ ] API 응답 시간 1초 이내%0A- [ ] 페이지 로딩 시간 3초 이내%0A- [ ] 크로스 브라우저 호환성%0A- [ ] 모바일 반응형 동작%0A- [ ] HTTPS 적용%0A- [ ] JWT 인증 정상 동작%0A%0A**비즈니스 성공 기준:**%0A- [ ] MVP 기능 100%% 구현 (P0)%0A- [ ] 4일 이내 런칭%0A- [ ] 사용자 플로우 완성%0A- [ ] 문서화 완료%0A%0A## 의존성%0A%0A**Dependencies (선행 작업):**%0A- 모든 Task 완료%0A%0A**Blocks (후행 작업):**%0A- 프로젝트 완료%0A- Phase 5 (2차 개발) 계획%0A%0A## 예상 소요 시간%0A%0A0.5시간%0A%0A## 우선순위%0A%0AP0 (필수)"

echo.

echo ======================================
echo Phase 4 이슈 생성 완료
echo ======================================
echo.
echo Phase 4의 7개 이슈가 생성되었습니다.
echo.
pause

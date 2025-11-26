## Todo

PostgreSQL 15+ 개발 환경 구축

### 작업 내용

- PostgreSQL 15+ 설치 (Windows 환경)
- pgAdmin 또는 DBeaver 설치 (DB 관리 도구)
- 로컬 PostgreSQL 서버 실행 확인
- 데이터베이스 생성 (`igk_todolist_dev`)
- 연결 테스트 (`psql` 또는 GUI 도구)

## 완료 조건

- [ ] PostgreSQL 서비스 실행 중
- [ ] `igk_todolist_dev` 데이터베이스 생성 완료
- [ ] 연결 문자열 확인: `postgresql://localhost:5432/igk_todolist_dev`
- [ ] 관리 도구로 접속 가능

## 기술적 고려사항

**기술 스택:**
- PostgreSQL 15+
- pgAdmin / DBeaver

**설정 사항:**
- Port: 5432 (기본값)
- Database: igk_todolist_dev
- 환경 변수 준비 (DATABASE_URL)

## 의존성

**Dependencies (선행 작업):**
- 없음 (독립 작업)

**Blocks (후행 작업):**
- Task 1.2: 데이터베이스 스키마 작성

## 예상 소요 시간

1시간

## 우선순위

P0 (필수)
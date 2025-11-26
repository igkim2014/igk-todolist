# GitHub 이슈 생성 가이드

## 개요

이 가이드는 IGK-TodoList 프로젝트의 GitHub 이슈를 자동으로 생성하는 방법을 설명합니다.

실행 계획(7-execution-plan.md)과 PRD(3-prd.md)를 기반으로 총 **27개의 GitHub 이슈**가 생성됩니다.

---

## 사전 요구사항

### 1. GitHub CLI 설치

**Windows (winget 사용):**

```bash
winget install --id GitHub.cli
```

**수동 설치:**

- https://cli.github.com/ 접속
- Windows installer 다운로드 및 설치

**설치 확인:**

```bash
gh --version
```

### 2. GitHub CLI 인증

```bash
gh auth login
```

프롬프트에 따라 진행:

1. GitHub.com 선택
2. HTTPS 선택
3. 브라우저에서 인증 완료

**인증 확인:**

```bash
gh auth status
```

### 3. Git 저장소 확인

현재 디렉토리가 Git 저장소이고 GitHub에 연결되어 있는지 확인:

```bash
cd C:\test\igk-todolist
gh repo view
```

---

## 이슈 생성 방법

### 방법 1: 모든 Phase 한 번에 생성 (권장)

```bash
create_all_issues.bat
```

이 스크립트는 다음을 순차적으로 실행합니다:

- Phase 1: 데이터베이스 구축 (4개 이슈)
- Phase 2: 백엔드 개발 (8개 이슈)
- Phase 3: 프론트엔드 개발 (8개 이슈)
- Phase 4: 통합 및 배포 (7개 이슈)

**예상 소요 시간:** 약 5-10분

### 방법 2: Phase별로 개별 실행

각 Phase를 따로 실행할 수 있습니다:

```bash
# Phase 1만 실행
create_github_issues.bat

# Phase 2만 실행
create_issues_phase2.bat

# Phase 3만 실행
create_issues_phase3.bat

# Phase 4만 실행
create_issues_phase4.bat
```

---

## 생성되는 이슈 목록

### Phase 1: 데이터베이스 구축 (4개)

1. **Task 1.1:** 로컬 PostgreSQL 설치 및 설정

   - Labels: `infrastructure`, `database`, `complexity: low`, `priority: p0`
   - 예상 시간: 1시간

2. **Task 1.2:** 데이터베이스 스키마 작성 (schema.sql)

   - Labels: `database`, `backend`, `complexity: medium`, `priority: p0`
   - 예상 시간: 2시간

3. **Task 1.3:** 스키마 실행 및 검증

   - Labels: `database`, `testing`, `complexity: low`, `priority: p0`
   - 예상 시간: 0.5시간

4. **Task 1.4:** 초기 데이터 삽입 (국경일)
   - Labels: `database`, `data`, `complexity: low`, `priority: p1`
   - 예상 시간: 0.5시간

### Phase 2: 백엔드 개발 (8개)

5. **Task 2.1:** 백엔드 프로젝트 초기화
6. **Task 2.2:** 디렉토리 구조 생성
7. **Task 2.3:** 데이터베이스 연결 설정
8. **Task 2.4-2.7:** 유틸리티 및 미들웨어 작성 (통합)
9. **Task 2.8:** 인증 API 구현
10. **Task 2.9:** 할일 CRUD API 구현
11. **Task 2.10:** 휴지통 API 구현
12. **Task 2.11:** 국경일 API 구현
13. **Task 2.12-2.14:** Rate Limiting, 앱 통합, 테스트 (통합)

### Phase 3: 프론트엔드 개발 (8개)

14. **Task 3.1:** 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)
15. **Task 3.2-3.4:** 디렉토리 구조, Axios, 유틸리티 설정 (통합)
16. **Task 3.5-3.7:** Zustand 스토어 및 API 서비스 레이어 (통합)
17. **Task 3.8-3.10:** 공통 컴포넌트, 라우팅, 레이아웃 (통합)
18. **Task 3.11:** 인증 화면 구현 (로그인, 회원가입)
19. **Task 3.12-3.14:** 할일 컴포넌트, 목록 페이지, 추가/수정 모달 (통합)
20. **Task 3.15-3.17:** 휴지통, 국경일, 프로필 페이지 (통합)
21. **Task 3.18-3.20:** 반응형 디자인, 다크모드, 통합 테스트 (통합)

### Phase 4: 통합 및 배포 (7개)

22. **Task 4.1:** 프론트엔드-백엔드 통합 테스트
23. **Task 4.2:** Supabase PostgreSQL 설정
24. **Task 4.3:** Vercel 백엔드 배포
25. **Task 4.4:** Vercel 프론트엔드 배포
26. **Task 4.5:** 프로덕션 환경 테스트
27. **Task 4.6:** 문서화 및 README 작성
28. **Task 4.7:** 최종 점검 및 런칭

---

## 이슈 구조

각 이슈에는 다음 항목이 포함됩니다:

### 1. Title

형식: `[Phase X] Task X.X: 작업 제목`

예시: `[Phase 1] Task 1.1: 로컬 PostgreSQL 설치 및 설정`

### 2. Labels

**종류:**

- `backend`, `frontend`, `database`, `infrastructure`, `documentation`

**복잡도:**

- `complexity: low` - 단순 작업
- `complexity: medium` - 중간 난이도
- `complexity: high` - 복잡한 작업

**우선순위:**

- `priority: p0` - 필수 (MVP)
- `priority: p1` - 선택적 구현

**기능 영역:**

- `feature`, `setup`, `testing`, `deployment`, `integration`

### 3. 본문 내용

각 이슈는 다음 섹션으로 구성됩니다:

#### Todo

- 작업 내용 요약

#### 완료 조건

- [ ] 체크리스트 형태의 완료 기준

#### 기술적 고려사항

- 주요 기술 스택
- 구현 방법
- 코드 예시

#### 의존성

- **Dependencies (선행 작업):** 이 작업을 시작하기 전에 완료되어야 할 작업
- **Blocks (후행 작업):** 이 작업이 완료되어야 시작할 수 있는 작업

#### 예상 소요 시간

- 실행 계획에 명시된 예상 시간

#### 우선순위

- P0 (필수) 또는 P1 (선택)

---

## 이슈 확인

### CLI에서 확인

```bash
# 최근 50개 이슈 목록
gh issue list --limit 50

# 특정 라벨로 필터링
gh issue list --label "priority: p0"
gh issue list --label "backend"
gh issue list --label "complexity: high"

# 모든 이슈 보기
gh issue list --state all
```

### 웹에서 확인

```bash
# 브라우저에서 저장소 열기
gh repo view --web
```

GitHub 웹 UI에서:

- Issues 탭으로 이동
- Labels로 필터링
- Milestones로 그룹화 (선택)

---

## 이슈 관리 권장 사항

### 1. Milestone 생성

각 Phase를 Milestone으로 관리:

```bash
gh api repos/:owner/:repo/milestones -f title="Phase 1: 데이터베이스 구축"
gh api repos/:owner/:repo/milestones -f title="Phase 2: 백엔드 개발"
gh api repos/:owner/:repo/milestones -f title="Phase 3: 프론트엔드 개발"
gh api repos/:owner/:repo/milestones -f title="Phase 4: 통합 및 배포"
```

### 2. Project Board 활용

GitHub Projects에서 칸반 보드 생성:

- **To Do:** 시작 전
- **In Progress:** 진행 중
- **Review:** 검토 중
- **Done:** 완료

### 3. Assignee 설정

자신을 담당자로 지정:

```bash
gh issue edit <issue-number> --add-assignee @me
```

### 4. 이슈 닫기

작업 완료 시:

```bash
# CLI에서 닫기
gh issue close <issue-number>

# 커밋 메시지로 자동 닫기
git commit -m "Feat: Task 1.1 완료 - PostgreSQL 설치

Closes #<issue-number>"
```

---

## 트러블슈팅

### 문제 1: GitHub CLI 명령어 실행 안됨

**증상:**

```
'gh'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
```

**해결 방법:**

1. GitHub CLI 재설치
2. 시스템 재시작
3. 환경 변수 PATH 확인

### 문제 2: 인증 오류

**증상:**

```
error: authentication failed
```

**해결 방법:**

```bash
# 로그아웃 후 재인증
gh auth logout
gh auth login
```

### 문제 3: 저장소 연결 안됨

**증상:**

```
error: not a git repository
```

**해결 방법:**

```bash
# Git 저장소 초기화 및 리모트 추가
git init
git remote add origin <repository-url>
```

### 문제 4: 이슈 생성 실패

**증상:**
이슈가 일부만 생성되거나 에러 발생

**해결 방법:**

1. 인터넷 연결 확인
2. GitHub API Rate Limit 확인
   ```bash
   gh api rate_limit
   ```
3. 개별 Phase 스크립트로 재시도

---

## 추가 정보

### Label 색상 코드

프로젝트에서 사용하는 주요 Label 색상:

- `priority: p0` - 빨강 (#E53935)
- `priority: p1` - 주황 (#FF7043)
- `complexity: low` - 초록 (#66BB6A)
- `complexity: medium` - 노랑 (#FFEB3B)
- `complexity: high` - 빨강 (#E53935)
- `backend` - 파랑 (#2196F3)
- `frontend` - 보라 (#9C27B0)
- `database` - 갈색 (#795548)

### 이슈 템플릿 커스터마이징

이슈 내용을 수정하려면 각 `.bat` 파일을 텍스트 에디터로 열어 수정하세요.

**주의:** URL 인코딩을 유지해야 합니다.

- `%0A` = 줄바꿈 (Line Feed)
- `%0A%0A` = 빈 줄
- `%%` = % 기호 (배치 파일에서)

---

## 참고 문서

- [실행 계획](./docs/7-execution-plan.md)
- [PRD](./docs/3-prd.md)
- [GitHub CLI 공식 문서](https://cli.github.com/manual/)
- [GitHub Issues 가이드](https://docs.github.com/en/issues)

---

## 문의

이슈 생성 중 문제가 발생하면 프로젝트 매니저에게 문의하세요.

---

**작성일:** 2025-11-26
**버전:** 1.0
**작성자:** Project Manager (Claude)

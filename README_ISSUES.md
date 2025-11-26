# GitHub 이슈 자동 생성 - 빠른 시작 가이드

## 빠른 시작 (3단계)

### 1단계: GitHub CLI 설치 및 인증

```bash
# Windows (winget 사용)
winget install --id GitHub.cli

# 인증
gh auth login
```

### 2단계: 저장소 확인

```bash
cd C:\test\igk-todolist
gh repo view
```

### 3단계: 이슈 생성

```bash
# 모든 이슈 한 번에 생성 (권장)
create_all_issues.bat

# 또는 Phase별로 개별 실행
create_github_issues.bat        # Phase 1 (4개)
create_issues_phase2.bat        # Phase 2 (8개)
create_issues_phase3.bat        # Phase 3 (8개)
create_issues_phase4.bat        # Phase 4 (7개)
```

---

## 생성되는 이슈 요약

| Phase | 주제 | 이슈 개수 | 예상 시간 |
|-------|------|----------|----------|
| Phase 1 | 데이터베이스 구축 | 4개 | 3-4시간 |
| Phase 2 | 백엔드 개발 | 8개 | 16-18시간 |
| Phase 3 | 프론트엔드 개발 | 8개 | 28-32시간 |
| Phase 4 | 통합 및 배포 | 7개 | 4-6시간 |
| **총합** | - | **27개** | **51-60시간** |

---

## 주요 Label

- **우선순위:**
  - `priority: p0` - 필수 (MVP)
  - `priority: p1` - 선택적 구현

- **복잡도:**
  - `complexity: low` - 단순 작업
  - `complexity: medium` - 중간 난이도
  - `complexity: high` - 복잡한 작업

- **영역:**
  - `backend`, `frontend`, `database`, `infrastructure`, `documentation`

---

## 이슈 확인

```bash
# CLI에서 확인
gh issue list --limit 50

# P0 (필수) 이슈만 보기
gh issue list --label "priority: p0"

# 브라우저에서 확인
gh repo view --web
```

---

## 파일 구조

```
C:\test\igk-todolist\
├── create_all_issues.bat           # 통합 실행 스크립트
├── create_github_issues.bat        # Phase 1
├── create_issues_phase2.bat        # Phase 2
├── create_issues_phase3.bat        # Phase 3
├── create_issues_phase4.bat        # Phase 4
├── ISSUE_CREATION_GUIDE.md         # 상세 가이드
└── README_ISSUES.md                # 이 파일
```

---

## 문제 해결

### GitHub CLI가 설치되지 않음

```bash
winget install --id GitHub.cli
```

### 인증 오류

```bash
gh auth logout
gh auth login
```

### 저장소 연결 안됨

```bash
git remote add origin <repository-url>
```

---

## 상세 가이드

더 자세한 정보는 [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md)를 참조하세요.

---

## 참고 문서

- [실행 계획](./docs/7-execution-plan.md) - 전체 Task 상세 내용
- [PRD](./docs/3-prd.md) - 제품 요구사항 명세서
- [GitHub CLI 문서](https://cli.github.com/manual/)

---

**작성일:** 2025-11-26
**프로젝트:** IGK-TodoList
**총 이슈 개수:** 27개 (일부 통합됨)

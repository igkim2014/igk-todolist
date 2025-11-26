# IGK-TodoList

## 프로젝트 개요
IGK-TodoList는 사용자 인증 기반의 개인 할일 관리 애플리케이션으로, 사용자별 할일 목록과 공통 국경일 일정을 통합 관리하는 웹 애플리케이션입니다. 단순함, 통합 관리, 복원 가능성, 접근성을 핵심 가치로 합니다.

## 주요 기능
- **사용자 인증**: JWT 기반 회원가입, 로그인, 로그아웃, 토큰 갱신
- **할일 관리**: 생성, 조회, 수정, 완료, 소프트 삭제(휴지통), 복원
- **휴지통 기능**: 삭제된 할일 조회 및 영구 삭제
- **국경일 표시**: 모든 사용자가 국경일 목록 조회 가능 (관리자만 추가/수정 가능)
- **사용자 프로필**: 조회 및 수정
- **반응형 디자인**: 데스크톱 및 모바일 지원
- **다크모드**: 지원 (P1 우선순위)

## 기술 스택

### 🚀 프론트엔드
- **Framework**: React 18
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Build Tool**: Vite

### ⚙️ 백엔드
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API Style**: REST API
- **Authentication**: JWT (jsonwebtoken)
- **ORM**: Prisma
- **Hashing**: bcryptjs

### 🗄️ 데이터베이스
- **Database**: PostgreSQL 15+
- **Hosting**: Supabase
- **ORM**: Prisma

### 🌐 배포 및 인프라
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Vercel (Serverless Functions)
- **Database Hosting**: Supabase PostgreSQL
- **Version Control**: Git + GitHub

## 프로젝트 실행 방법

### 1. 사전 준비

- Node.js (v18 이상) 및 npm/yarn 설치
- PostgreSQL 데이터베이스 설치 또는 Supabase 계정 준비
- Git 설치

### 2. 프로젝트 클론

```bash
git clone [YOUR_REPOSITORY_URL]
cd igk-todolist
```

### 3. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다.

**`./backend/.env` (백엔드)**
```
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?schema=public"
JWT_SECRET="your_strong_jwt_secret_key"
JWT_ACCESS_TOKEN_EXPIRY="15m"
JWT_REFRESH_TOKEN_EXPIRY="7d"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173" # 프론트엔드 개발 서버 주소
```

**`./frontend/.env` (프론트엔드)**
```
VITE_API_BASE_URL="http://localhost:3000/api" # 백엔드 API 주소
```

**`.env.example` 파일은 프로젝트 루트에 `backend/.env.example`과 `frontend/.env.example`로 존재합니다.**

### 4. 데이터베이스 초기화 (백엔드)

1.  백엔드 디렉토리로 이동합니다.
    ```bash
    cd backend
    ```
2.  의존성 설치
    ```bash
    npm install
    ```
3.  Prisma 마이그레이션을 실행하여 데이터베이스 스키마를 적용합니다.
    ```bash
    npx prisma migrate dev --name init
    ```
    (만약 DB가 없거나 연결이 안될 경우, `.env` 파일의 `DATABASE_URL`을 올바르게 설정했는지 확인하세요.)
4.  Prisma Client를 생성합니다.
    ```bash
    npx prisma generate
    ```

### 5. 백엔드 서버 실행

1.  백엔드 디렉토리(`backend`)에서 서버를 실행합니다.
    ```bash
    npm run start # 또는 npm start (package.json에 start 스크립트 추가 후)
    # 개발 모드는 nodemon 설치 후 npm run dev
    ```

### 6. 프론트엔드 애플리케이션 실행

1.  프론트엔드 디렉토리로 이동합니다.
    ```bash
    cd frontend
    ```
2.  의존성 설치
    ```bash
    npm install
    ```
3.  개발 서버를 실행합니다.
    ```bash
    npm run dev
    ```
4.  브라우저에서 `http://localhost:5173`으로 접속합니다.

## 개발 가이드

### 문서 링크
- [PRD (제품 요구사항 정의서)](./docs/3-prd.md)
- [사용자 시나리오](./docs/4-user-scenarios.md)
- [아키텍처 다이어그램](./docs/5-arch-diagram.md)
- [프로젝트 구조](./docs/5-project-structure.md)
- [ERD (개체 관계 다이어그램)](./docs/6-erd.md)
- [실행 계획](./docs/7-execution-plan.md)
- [와이어프레임](./docs/8-wireframes.md)
- [테스트 시나리오](./docs/TEST_SCENARIOS.md)
- [회원가입 High-Fidelity 와이어프레임](./docs/wireframes/signup_mockup.svg)

### 코드 스타일
- ESLint와 Prettier가 설정되어 있습니다.
- `npm run lint` 및 `npm run format`으로 코드 스타일을 맞출 수 있습니다.

### 테스트
- `docs/TEST_SCENARIOS.md`를 참고하여 주요 기능을 수동으로 테스트할 수 있습니다.
- 백엔드 단위/통합 테스트는 `backend/tests/` 디렉토리에 추가할 수 있습니다.

## 기여자
- Claude (원문서 작성자)
- Gemini (코드 구현 및 문서화)
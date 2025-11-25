# GEMINI.md - IGK-TodoList 프로젝트 설계 원칙

이 문서는 IGK-TodoList 프로젝트의 아키텍처, 코드 스타일, 배포 및 운영에 대한 핵심 원칙을 정의합니다. 모든 개발 과정에서 이 원칙을 따르는 것을 목표로 합니다.

## 1. 최상위 공통 원칙

- **단순성 (Simplicity)**: 복잡한 로직이나 불필요한 추상화를 지양합니다. 코드는 명확하고 이해하기 쉬워야 하며, 최소한의 기능으로 요구사항을 만족시키는 데 집중합니다. (PRD 1.3, 6.2.1)
- **속도 (Speed)**: 사용자의 상호작용이 즉각적으로 느껴지도록 설계합니다. 낙관적 업데이트(Optimistic Update)를 적극적으로 사용하고, API 응답 시간은 1초 이내를 목표로 합니다. (PRD 6.2.2, 7.1.2)
- **안전성 (Safety)**: 사용자의 데이터는 안전하게 보호되어야 합니다. 모든 사용자 입력은 검증하고, 보안 모범 사례를 준수하며, 실수로 인한 데이터 손실을 방지하는 기능(휴지통)을 제공합니다. (PRD 1.3, 7.2)
- **관심사 분리 (Separation of Concerns)**: 프론트엔드와 백엔드를 명확히 분리하고, 각 내부에서도 기능별 모듈(인증, 할일, 휴지통 등)로 코드를 분리하여 유지보수성을 높입니다.

## 2. 의존성 및 레이어 원칙

- **명확한 클라이언트-서버 분리**: 프론트엔드(React)와 백엔드(Express)는 독립적으로 개발 및 배포됩니다. 둘 사이의 통신은 오직 REST API를 통해서만 이루어집니다.
- **백엔드 3-Layer 아키텍처**: 백엔드 로직은 다음과 같은 계층으로 구성됩니다.
    1.  `Controller`: HTTP 요청을 받아 유효성을 검증하고, Service 계층에 처리를 위임합니다.
    2.  `Service`: 핵심 비즈니스 로직을 처리합니다. 데이터베이스와 직접 상호작용하지 않습니다.
    3.  `Data Access (Prisma)`: 데이터베이스와의 모든 상호작용(CRUD)을 담당합니다.
- **프론트엔드 계층 구조**: 프론트엔드는 다음과 같은 구조로 역할이 분리됩니다.
    1.  `Pages`: 라우팅의 단위가 되는 최상위 컴포넌트입니다.
    2.  `Components`: 재사용 가능한 UI 조각으로, `common`(범용), `layout`(구조), 기능별(e.g., `todos`)로 나뉩니다.
    3.  `Services`: 백엔드 API와의 통신을 담당합니다.
    4.  `Stores (Zustand)`: 전역 상태(사용자 인증 정보, 다크 모드 등)를 관리합니다.

## 3. 코드 및 네이밍 원칙

- **프레임워크 컨벤션 준수**: 각 기술 스택(React, Express, Prisma)의 공식 스타일 가이드와 모범 사례를 따릅니다.
- **네이밍 규칙**:
    - 컴포넌트, 모델(Prisma): `PascalCase` (e.g., `TodoListPage`, `TodoItem`)
    - 변수, 함수, 파일명: `camelCase` (e.g., `authController`, `getUserTodos`)
    - API 엔드포인트: 복수형 명사 사용 (e.g., `/api/todos`, `/api/users`)
- **일관성**: 프로젝트 전반에 걸쳐 일관된 코드 스타일과 네이밍 컨벤션을 유지합니다.
- **타입 안정성**: TypeScript(프론트엔드)와 Prisma(백엔드)를 활용하여 데이터 모델과 API 통신에서 타입 안정성을 최대한 확보합니다.

## 4. 테스트 및 품질 원칙

- **사용자 시나리오 기반 테스트**: MVP의 핵심 기능(회원가입, 로그인, 할일 CRUD, 휴지통)은 사용자의 주요 시나리오를 바탕으로 통합 테스트를 진행하여 동작을 보장합니다. (PRD 8.4.2)
- **수동 테스트 우선**: 초기 단계에서는 자동화된 테스트보다 핵심 기능에 대한 수동 테스트와 QA에 집중하여 빠른 배포 주기를 유지합니다.
- **코드 리뷰**: 모든 코드는 배포 전 동료 리뷰를 거쳐 잠재적인 버그를 줄이고 설계 원칙 준수 여부를 확인하는 것을 권장합니다.
- **에러 핸들링**: 예측 가능한 모든 에러(입력값 오류, 권한 없음 등)에 대해 명확한 에러 메시지를 사용자에게 반환하고, 서버 내부 에러는 로그로 기록합니다. (PRD 5.2.2)

## 5. 설정, 보안, 운영 원칙

- **환경 변수 사용**: 모든 민감 정보(DB 연결 문자열, JWT 시크릿 키)는 `.env` 파일에 저장하고, Git에 커밋하지 않습니다. (PRD 7.2.2)
- **보안 기본 원칙 준수**: (PRD 7.2)
    - 모든 통신은 HTTPS를 사용합니다.
    - 비밀번호는 `bcrypt`를 사용하여 해시 처리 후 저장합니다.
    - SQL Injection은 ORM(Prisma)을 통해 방어합니다.
    - XSS/CSRF 방어 조치를 적용합니다.
    - API에는 `express-rate-limit`을 적용하여 무차별 공격을 방지합니다.
- **인증 방식**: Access Token(15분)과 Refresh Token(7일)을 사용하는 JWT 기반 인증을 따릅니다. Refresh Token은 HttpOnly 쿠키에 저장하여 보안을 강화합니다. (PRD 5.1, 7.2.1)
- **배포 자동화**: 프론트엔드와 백엔드는 Vercel에 배포하며, GitHub 리포지토리와 연동하여 CI/CD를 구성합니다. (PRD 5.1)

## 6. 디렉토리 구조 (PRD 5.4 기반)

### 프론트엔드 (`frontend`)

```
igk-todolist-frontend/
├── public/
├── src/
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── common/       # 공통 컴포넌트 (Button, Input, Modal 등)
│   │   ├── todos/        # 할일 관련 컴포넌트
│   │   └── layout/       # 레이아웃 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── LoginPage.tsx
│   │   ├── TodoListPage.tsx
│   │   └── TrashPage.tsx
│   ├── stores/           # Zustand 상태 관리
│   │   ├── authStore.ts
│   │   └── todoStore.ts
│   ├── services/         # API 호출 서비스
│   │   ├── authService.ts
│   │   └── todoService.ts
│   ├── hooks/            # 커스텀 훅
│   ├── utils/            # 유틸리티 함수
│   ├── types/            # TypeScript 타입 정의
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── tailwind.config.js
```

### 백엔드 (`backend`)

```
igk-todolist-backend/
├── src/
│   ├── controllers/      # 요청 처리 로직
│   │   ├── authController.js
│   │   ├── todoController.js
│   │   └── trashController.js
│   ├── middlewares/      # 미들웨어
│   │   ├── auth.js       # 인증 미들웨어
│   │   └── errorHandler.js
│   ├── routes/           # API 라우트
│   │   ├── auth.js
│   │   ├── todos.js
│   │   └── trash.js
│   ├── services/         # 비즈니스 로직
│   │   ├── authService.js
│   │   └── todoService.js
│   ├── utils/            # 유틸리티 함수
│   │   ├── jwt.js
│   │   └── validator.js
│   ├── prisma/           # Prisma 설정
│   │   └── schema.prisma
│   ├── app.js            # Express 앱 설정
│   └── server.js         # 서버 시작
├── .env
└── package.json
```

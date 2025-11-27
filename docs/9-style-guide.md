# igk-TodoList 스타일 가이드

**버전**: 1.0
**작성일**: 2025-11-27
**상태**: 최종
**작성자**: Claude
**참조 문서**:
- [프로젝트 구조](./5-project-structure.md)
- [PRD](./3-prd.md)
- [ERD](./6-erd.md)

---

## 목차

1. [개요](#1-개요)
2. [Git 커밋 컨벤션](#2-git-커밋-컨벤션)
3. [브랜치 전략](#3-브랜치-전략)
4. [코드 스타일](#4-코드-스타일)
5. [네이밍 컨벤션](#5-네이밍-컨벤션)
6. [디렉토리 구조](#6-디렉토리-구조)
7. [문서화 규칙](#7-문서화-규칙)
8. [API 설계 가이드](#8-api-설계-가이드)
9. [데이터베이스 컨벤션](#9-데이터베이스-컨벤션)
10. [에러 처리](#10-에러-처리)

---

## 1. 개요

### 1.1 목적

igk-TodoList 프로젝트의 일관된 코드 품질과 유지보수성을 보장하기 위한 스타일 가이드입니다.

### 1.2 적용 범위

- 백엔드 API (Node.js/Express)
- 데이터베이스 스키마 (PostgreSQL/Prisma)
- Git 커밋 및 브랜치 관리
- 문서화 (Markdown)

### 1.3 핵심 원칙

1. **일관성**: 모든 코드는 동일한 스타일을 따름
2. **명확성**: 변수명, 함수명은 의도를 명확히 표현
3. **간결성**: 오버엔지니어링 금지
4. **한국어 우선**: 모든 입출력은 한국어로 작성

---

## 2. Git 커밋 컨벤션

### 2.1 커밋 메시지 형식

```
<type>: <subject>

[optional body]

[optional footer]
```

### 2.2 Type 분류

| Type | 설명 | 예시 |
|------|------|------|
| `Feat` | 새로운 기능 추가 | `Feat: Implement MVP for IGK-TodoList` |
| `Fix` | 버그 수정 | `Fix: Resolve authentication error` |
| `Refactor` | 코드 리팩토링 (기능 변경 없음) | `Refactor: Optimize database queries` |
| `Docs` | 문서 수정 | `Docs: Update API documentation` |
| `Style` | 코드 포맷팅 (세미콜론, 공백 등) | `Style: Format code with prettier` |
| `Test` | 테스트 코드 추가/수정 | `Test: Add user authentication tests` |
| `Chore` | 빌드, 패키지 관리 등 | `Chore: Update dependencies` |
| `Complete` | 작업 완료 | `Complete task 2.1: Backend project initialization` |

### 2.3 Subject 규칙

- **한글 또는 영어** 사용 가능
- **첫 글자는 대문자** (영어의 경우)
- **마침표 없음**
- **명령문** 사용 (동사 원형)
- **50자 이내** 권장

### 2.4 커밋 메시지 예시

#### ✅ 좋은 예시

```
Feat: Implement user authentication API

- JWT 토큰 기반 인증 구현
- 회원가입, 로그인, 로그아웃 API 추가
- Refresh token 갱신 기능 구현
```

```
Fix: Resolve database connection timeout

타임아웃 설정을 30초로 증가시켜 대용량 쿼리 처리 개선
```

```
Complete task 2.3: Database connection setup with enhanced testing
```

```
phase 1 완료
```

#### ❌ 나쁜 예시

```
수정함
```

```
bug fix
```

```
WIP
```

### 2.5 실제 프로젝트 커밋 패턴

프로젝트에서 사용된 실제 커밋 메시지:

- `phase 1 완료`
- `Feat: Task 2.1 완료 - 백엔드 프로젝트 초기화`
- `Complete task 2.5: Password hashing utility with enhanced error handling`
- `gemini, qwen용 슬래시 명령어 추가`
- `변경` (지양, 더 구체적으로 작성 권장)

---

## 3. 브랜치 전략

### 3.1 브랜치 유형

| 브랜치 | 용도 | 네이밍 | 예시 |
|--------|------|--------|------|
| `main` | 프로덕션 안정 버전 | `main` | `main` |
| `develop` | 개발 통합 브랜치 | `develop` | `develop` |
| `feature` | 새로운 기능 개발 | `feature/<기능명>` | `feature/user-auth` |
| `bugfix` | 버그 수정 | `bugfix/<이슈번호>-<설명>` | `bugfix/123-login-error` |
| `hotfix` | 긴급 수정 | `hotfix/<버전>-<설명>` | `hotfix/1.0.1-security` |

### 3.2 브랜치 워크플로우

```
main (프로덕션)
 ↑
 └── develop (개발)
      ↑
      ├── feature/user-auth
      ├── feature/todo-crud
      └── bugfix/123-login-error
```

### 3.3 브랜치 생성 및 병합

```bash
# Feature 브랜치 생성
git checkout -b feature/user-auth develop

# 작업 완료 후 develop에 병합
git checkout develop
git merge --no-ff feature/user-auth

# main으로 릴리즈
git checkout main
git merge --no-ff develop
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 3.4 현재 프로젝트 상태

- **main 브랜치**: 안정 버전
- **2 Branches**: main 포함 2개 브랜치 존재
- **0 Tags**: 태그 미사용 (향후 버전 태깅 권장)
- **38 Commits**: 38개 커밋 히스토리

---

## 4. 코드 스타일

### 4.1 JavaScript/Node.js 스타일

#### 4.1.1 들여쓰기

- **2칸 공백** 사용
- 탭 문자 사용 금지

```javascript
// ✅ 좋은 예시
function getTodos() {
  const todos = [];
  return todos;
}

// ❌ 나쁜 예시
function getTodos() {
    const todos = [];
    return todos;
}
```

#### 4.1.2 세미콜론

- **세미콜론 필수** 사용

```javascript
// ✅ 좋은 예시
const user = { name: 'John' };
console.log(user);

// ❌ 나쁜 예시
const user = { name: 'John' }
console.log(user)
```

#### 4.1.3 따옴표

- **작은따옴표 (')**  우선 사용
- 템플릿 리터럴은 백틱 (`) 사용

```javascript
// ✅ 좋은 예시
const message = '할일을 찾을 수 없습니다';
const greeting = `안녕하세요, ${username}님`;

// ❌ 나쁜 예시
const message = "할일을 찾을 수 없습니다";
```

#### 4.1.4 변수 선언

- `const` 우선 사용
- 재할당 필요 시 `let` 사용
- `var` 사용 금지

```javascript
// ✅ 좋은 예시
const apiUrl = '/api/todos';
let counter = 0;

// ❌ 나쁜 예시
var apiUrl = '/api/todos';
```

#### 4.1.5 화살표 함수

- 간결한 콜백에는 화살표 함수 사용
- `this` 바인딩 필요 시 일반 함수 사용

```javascript
// ✅ 좋은 예시
const getTodos = async () => {
  return await prisma.todo.findMany();
};

todos.map(todo => todo.title);

// ❌ 나쁜 예시
const getTodos = function() {
  return prisma.todo.findMany();
};
```

### 4.2 Prisma 스타일

#### 4.2.1 모델 정의

```prisma
// ✅ 좋은 예시
model User {
  userId    String   @id @default(uuid())
  email     String   @unique
  password  String
  username  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}

// 필드는 정렬 순서 준수:
// 1. ID 필드
// 2. 외래키 필드
// 3. 일반 필드 (알파벳 순)
// 4. 타임스탬프 (createdAt, updatedAt)
// 5. 관계 필드
```

### 4.3 SQL 스타일

- 키워드는 **대문자**
- 테이블명, 컬럼명은 **PascalCase** (Prisma 컨벤션)

```sql
-- ✅ 좋은 예시
SELECT userId, email, username
FROM "User"
WHERE role = 'admin'
ORDER BY createdAt DESC;

-- ❌ 나쁜 예시
select userid, email, username
from user
where role = 'admin'
order by createdat desc;
```

---

## 5. 네이밍 컨벤션

### 5.1 파일 및 디렉토리

| 대상 | 형식 | 예시 |
|------|------|------|
| 디렉토리 | kebab-case | `src/middlewares/` |
| JavaScript 파일 | camelCase | `authController.js` |
| 설정 파일 | kebab-case | `schema.prisma` |
| 문서 파일 | kebab-case | `style-guide.md` |

### 5.2 변수 및 함수

| 대상 | 형식 | 예시 |
|------|------|------|
| 변수 | camelCase | `const userId = '123';` |
| 함수 | camelCase | `function getTodos() {}` |
| 클래스 | PascalCase | `class UserService {}` |
| 상수 | UPPER_SNAKE_CASE | `const MAX_LOGIN_ATTEMPTS = 5;` |
| Private 변수 | _camelCase | `const _privateKey = 'secret';` |

### 5.3 데이터베이스

| 대상 | 형식 | 예시 |
|------|------|------|
| 테이블명 | PascalCase | `User`, `Todo`, `Holiday` |
| 컬럼명 | camelCase | `userId`, `createdAt` |
| 인덱스명 | snake_case | `idx_user_email`, `idx_todo_user_status` |
| 제약조건 | snake_case | `fk_todo_user`, `check_todo_duedate` |

### 5.4 API 엔드포인트

- **kebab-case** 사용
- **복수형** 명사 사용
- RESTful 규칙 준수

```
✅ 좋은 예시
GET    /api/todos
POST   /api/todos
GET    /api/todos/:id
PUT    /api/todos/:id
DELETE /api/todos/:id

GET    /api/holidays
POST   /api/auth/login

❌ 나쁜 예시
GET /api/getTodos
POST /api/createTodo
GET /api/Todo/:id
```

---

## 6. 디렉토리 구조

### 6.1 전체 프로젝트 구조

```
igk-todolist/
├── .claude/              # Claude AI 설정
├── .gemini/commands/     # Gemini AI 슬래시 명령어
├── .qwen/commands/       # Qwen AI 슬래시 명령어
├── backend/              # 백엔드 API 서버
│   ├── prisma/           # Prisma 스키마
│   ├── src/
│   │   ├── config/       # 설정 파일
│   │   ├── controllers/  # 라우트 핸들러
│   │   ├── middlewares/  # 미들웨어
│   │   ├── routes/       # 라우터 정의
│   │   ├── services/     # 비즈니스 로직
│   │   ├── tests/        # 테스트 코드
│   │   ├── utils/        # 유틸리티 함수
│   │   ├── app.js        # Express 앱 설정
│   │   └── server.js     # 서버 엔트리포인트
│   ├── package.json
│   └── .env
├── database/             # 데이터베이스 스크립트
├── docs/                 # 프로젝트 문서
│   ├── 0-domain-definition-request.md
│   ├── 1-domain-definition.md
│   ├── 2-prd-input-template.md
│   ├── 3-prd.md
│   ├── 4-user-scenarios.md
│   ├── 5-project-structure.md
│   ├── 5-arch-diagram.md
│   ├── 6-erd.md
│   ├── 7-execution-plan.md
│   ├── 8-wireframes.md
│   └── 9-style-guide.md (이 문서)
├── mockup/               # 목업 서버
├── swagger/              # Swagger 문서 (레거시)
├── .gitignore
├── CLAUDE.md             # Claude AI 프로젝트 지침
└── README.md
```

### 6.2 백엔드 디렉토리 상세

```
backend/src/
├── config/
│   ├── database.js       # DB 연결 설정
│   └── swagger.js        # Swagger 설정
├── controllers/
│   ├── authController.js
│   ├── todoController.js
│   ├── userController.js
│   ├── holidayController.js
│   └── trashController.js
├── middlewares/
│   ├── authMiddleware.js         # JWT 인증
│   ├── errorMiddleware.js        # 에러 핸들링
│   ├── rateLimitMiddleware.js    # Rate limiting
│   └── validationMiddleware.js   # 입력 검증
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── todoRoutes.js
│   ├── userRoutes.js
│   ├── holidayRoutes.js
│   └── trashRoutes.js
├── services/
│   ├── authService.js
│   ├── todoService.js
│   ├── userService.js
│   ├── holidayService.js
│   └── trashService.js
├── tests/
│   ├── auth.test.js
│   ├── todo.test.js
│   ├── user.test.js
│   ├── holiday.test.js
│   └── trash.test.js
├── utils/
│   ├── jwtHelper.js
│   └── passwordHelper.js
├── app.js
└── server.js
```

---

## 7. 문서화 규칙

### 7.1 Markdown 문서 구조

모든 문서는 다음 구조를 따릅니다:

```markdown
# 문서 제목

**버전**: 1.0
**작성일**: YYYY-MM-DD
**상태**: 초안/검토중/최종
**작성자**: 작성자명
**참조 문서**:
- [문서1](./link1.md)
- [문서2](./link2.md)

---

## 목차

1. [섹션1](#1-섹션1)
2. [섹션2](#2-섹션2)

---

## 1. 섹션1

내용...

---

## 2. 섹션2

내용...

---

**문서 종료**
```

### 7.2 문서 네이밍 규칙

- **번호 접두사** 사용: `0-`, `1-`, `2-` 등
- **kebab-case** 사용
- **명확한 제목** 사용

```
docs/
├── 0-domain-definition-request.md
├── 1-domain-definition.md
├── 2-prd-input-template.md
├── 3-prd.md
├── 4-user-scenarios.md
├── 5-project-structure.md
├── 5-arch-diagram.md
├── 6-erd.md
├── 7-execution-plan.md
├── 8-wireframes.md
└── 9-style-guide.md
```

### 7.3 코드 주석

#### 7.3.1 JavaScript 주석

```javascript
/**
 * 사용자 인증을 처리하는 함수
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} JWT 토큰과 사용자 정보
 * @throws {Error} 인증 실패 시 에러 발생
 */
const login = async (email, password) => {
  // 사용자 조회
  const user = await prisma.user.findUnique({ where: { email } });

  // 비밀번호 검증
  if (!user || !await comparePassword(password, user.password)) {
    throw new Error('인증 실패');
  }

  return { token: generateToken(user), user };
};
```

#### 7.3.2 Swagger 주석

```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/login', authController.login);
```

---

## 8. API 설계 가이드

### 8.1 RESTful API 원칙

| HTTP 메서드 | 용도 | 예시 |
|-------------|------|------|
| GET | 조회 (Read) | `GET /api/todos` |
| POST | 생성 (Create) | `POST /api/todos` |
| PUT | 전체 수정 (Update) | `PUT /api/todos/:id` |
| PATCH | 부분 수정 (Partial Update) | `PATCH /api/todos/:id/complete` |
| DELETE | 삭제 (Delete) | `DELETE /api/todos/:id` |

### 8.2 응답 형식

#### 8.2.1 성공 응답

```json
{
  "success": true,
  "data": {
    "todoId": "uuid-1234",
    "title": "할일 제목",
    "status": "active"
  }
}
```

#### 8.2.2 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "TODO_NOT_FOUND",
    "message": "할일을 찾을 수 없습니다"
  },
  "timestamp": "2025-11-27T10:30:00.000Z",
  "path": "/api/todos/123"
}
```

### 8.3 상태 코드

| 코드 | 의미 | 사용 예시 |
|------|------|-----------|
| 200 | OK | 조회, 수정, 삭제 성공 |
| 201 | Created | 생성 성공 |
| 400 | Bad Request | 잘못된 요청 (유효성 검증 실패) |
| 401 | Unauthorized | 인증 실패 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 500 | Internal Server Error | 서버 오류 |

### 8.4 인증 헤더

```
Authorization: Bearer <JWT_TOKEN>
```

### 8.5 API 버전 관리

- URL 경로에 버전 포함: `/api/v1/todos`
- 현재는 버전 없이 `/api/todos` 사용
- 향후 버전 추가 시 `/api/v2/todos` 형식 권장

---

## 9. 데이터베이스 컨벤션

### 9.1 테이블 및 컬럼

- **테이블명**: PascalCase (`User`, `Todo`, `Holiday`)
- **컬럼명**: camelCase (`userId`, `createdAt`)
- **기본키**: `<테이블명소문자>Id` (예: `userId`, `todoId`)
- **외래키**: `<참조테이블소문자>Id` (예: `userId` in Todo 테이블)

### 9.2 타임스탬프

모든 테이블에 다음 필드 포함:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

삭제 가능한 엔티티는 소프트 삭제를 위한 필드 추가:

```prisma
deletedAt DateTime?
```

### 9.3 UUID 사용

모든 기본키는 UUID 사용:

```prisma
userId String @id @default(uuid())
```

### 9.4 인덱스 네이밍

```
idx_<테이블명>_<컬럼명>
idx_<테이블명>_<컬럼1>_<컬럼2>  (복합 인덱스)
```

예시:
- `idx_user_email`
- `idx_todo_user_status`
- `idx_holiday_date`

### 9.5 제약조건 네이밍

```
fk_<테이블명>_<참조테이블명>          (외래키)
check_<테이블명>_<컬럼명>             (체크 제약)
unique_<테이블명>_<컬럼명>            (고유 제약)
```

예시:
- `fk_todo_user`
- `check_todo_duedate`
- `unique_user_email`

---

## 10. 에러 처리

### 10.1 에러 코드 체계

| 코드 | 설명 |
|------|------|
| `USER_NOT_FOUND` | 사용자를 찾을 수 없음 |
| `INVALID_CREDENTIALS` | 잘못된 인증 정보 |
| `TODO_NOT_FOUND` | 할일을 찾을 수 없음 |
| `UNAUTHORIZED` | 권한 없음 |
| `VALIDATION_ERROR` | 유효성 검증 실패 |
| `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

### 10.2 에러 처리 패턴

```javascript
// 컨트롤러
const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id, req.user.userId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: '할일을 찾을 수 없습니다'
        },
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};
```

### 10.3 에러 미들웨어

```javascript
// errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || '서버 오류가 발생했습니다'
    },
    timestamp: new Date().toISOString(),
    path: req.path
  });
};
```

---

## 11. 테스트 가이드

### 11.1 테스트 파일 네이밍

```
src/tests/
├── auth.test.js
├── todo.test.js
├── user.test.js
├── holiday.test.js
└── trash.test.js
```

### 11.2 테스트 구조

```javascript
const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('회원가입 성공', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('이메일 중복 시 실패', async () => {
      // 테스트 로직
    });
  });
});
```

### 11.3 테스트 커버리지

- **목표 커버리지**: 80% 이상
- 명령어: `npm test -- --coverage`

---

## 12. 환경 변수 관리

### 12.1 .env 파일 구조

```bash
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# 서버
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="*"
```

### 12.2 환경별 설정

- **development**: `.env` (로컬 개발)
- **production**: `.env.production` (프로덕션)
- **test**: `.env.test` (테스트)

### 12.3 보안 규칙

- `.env` 파일은 **절대 Git에 커밋하지 않음**
- `.env.example` 파일로 예시 제공
- 민감한 정보는 환경 변수로 관리

---

## 13. 배포 가이드

### 13.1 배포 전 체크리스트

- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 환경 변수 설정 확인
- [ ] 데이터베이스 마이그레이션 실행 (`npx prisma migrate deploy`)
- [ ] 빌드 성공 확인
- [ ] 보안 취약점 스캔 (`npm audit`)

### 13.2 배포 명령어

```bash
# 1. 의존성 설치
npm ci

# 2. Prisma 클라이언트 생성
npx prisma generate

# 3. 마이그레이션 실행
npx prisma migrate deploy

# 4. 서버 시작
npm start
```

---

## 14. 참고 자료

### 14.1 외부 링크

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [REST API Design](https://restfulapi.net/)

### 14.2 프로젝트 관련 문서

- [프로젝트 구조](./5-project-structure.md)
- [ERD](./6-erd.md)
- [PRD](./3-prd.md)
- [실행 계획](./7-execution-plan.md)

---

## 부록

### A. 코드 리뷰 체크리스트

#### A.1 기본 사항
- [ ] 코드 스타일 가이드 준수
- [ ] 네이밍 컨벤션 준수
- [ ] 주석 및 문서화 적절
- [ ] 에러 처리 적절

#### A.2 보안
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 방지
- [ ] 민감한 정보 노출 방지

#### A.3 성능
- [ ] N+1 쿼리 방지
- [ ] 불필요한 데이터베이스 조회 최소화
- [ ] 적절한 인덱스 사용

#### A.4 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 테스트 커버리지 80% 이상

---

### B. 버전 관리

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 1.0 | 2025-11-27 | 초안 작성 | Claude |

---

### C. FAQ

**Q: 한글과 영어 중 어떤 것을 사용해야 하나요?**
A: 커밋 메시지와 주석은 한글 우선, 코드(변수명, 함수명)는 영어를 사용합니다.

**Q: 커밋 메시지에 'phase 1 완료' 같은 형식도 괜찮나요?**
A: 네, 프로젝트 마일스톤을 표시하는 경우 사용 가능합니다. 다만 일반 커밋에는 Type을 명시하는 것을 권장합니다.

**Q: Prisma에서 ENUM을 사용해야 하나요?**
A: 현재는 String을 사용하고 있으나, 향후 타입 안정성을 위해 Prisma Enum 전환을 고려할 수 있습니다.

**Q: API 버전은 언제 추가하나요?**
A: 현재는 `/api/` 경로를 사용하며, 하위 호환성이 깨지는 변경이 필요할 때 `/api/v2/` 형식으로 버전을 추가합니다.

---

**문서 종료**

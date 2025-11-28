## 변경 테스트

# Backend API - Clean Architecture with pg

이 프로젝트는 Prisma 대신 `pg` 라이브러리를 사용하여 Clean Architecture와 SOLID 원칙을 준수하도록 리팩토링되었습니다.

## 아키텍처 구조

```
backend/
├── src/
│   ├── database/          # Infrastructure Layer
│   │   └── pool.js        # PostgreSQL 연결 풀 (Singleton)
│   ├── repositories/      # Interface Adapter Layer
│   │   ├── base/
│   │   │   └── BaseRepository.js
│   │   ├── UserRepository.js
│   │   ├── TodoRepository.js
│   │   └── HolidayRepository.js
│   ├── services/          # Use Case Layer
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── todoService.js
│   │   ├── holidayService.js
│   │   └── trashService.js
│   ├── controllers/       # Interface Adapter Layer
│   ├── middlewares/       # Interface Adapter Layer
│   ├── routes/            # Interface Adapter Layer
│   └── config/            # Configuration
```

## SOLID 원칙 적용

### 1. Single Responsibility Principle (단일 책임 원칙)

- 각 Repository는 하나의 엔티티만 관리
- 각 Service는 하나의 비즈니스 도메인만 처리

### 2. Open/Closed Principle (개방/폐쇄 원칙)

- BaseRepository를 확장하여 새로운 Repository 생성 가능
- 기존 코드 수정 없이 새로운 기능 추가 가능

### 3. Liskov Substitution Principle (리스코프 치환 원칙)

- 모든 Repository는 BaseRepository의 메서드를 동일하게 사용 가능

### 4. Interface Segregation Principle (인터페이스 분리 원칙)

- 각 Repository는 필요한 메서드만 노출

### 5. Dependency Inversion Principle (의존성 역전 원칙)

- Service는 Repository 인터페이스에 의존 (구현체가 아님)
- 고수준 모듈(Service)이 저수준 모듈(Repository)에 의존하지 않음

## Clean Architecture 계층

### 1. Infrastructure Layer (database/)

- 외부 시스템과의 통신 (PostgreSQL)
- DB 연결 풀 관리

### 2. Interface Adapter Layer (repositories/)

- 데이터베이스와 도메인 간 변환
- Repository 패턴 구현

### 3. Use Case Layer (services/)

- 비즈니스 로직 처리
- 유효성 검증
- 트랜잭션 관리

### 4. Interface Adapter Layer (controllers/, routes/, middlewares/)

- HTTP 요청/응답 처리
- 라우팅
- 인증/권한 검증

## 실행 방법

### 개발 환경

```bash
npm run dev
```

### 프로덕션 환경

```bash
npm start
```

## Vercel 배포

이 프로젝트는 Vercel에 배포할 수 있도록 설정되어 있습니다.

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

### 배포 명령어

```bash
vercel
```

## 주요 변경 사항

### Prisma → pg 마이그레이션

1. **연결 관리**

   - `PrismaClient` → `pg.Pool`
   - 커넥션 풀링 직접 관리

2. **쿼리 실행**

   - Prisma Query → Raw SQL with Parameterized Queries
   - SQL Injection 방지를 위한 Prepared Statements 사용

3. **Repository 패턴**

   - BaseRepository로 공통 CRUD 로직 추상화
   - 엔티티별 특화 메서드는 각 Repository에서 구현

4. **트랜잭션**
   - Prisma `$transaction` → pg Client with BEGIN/COMMIT/ROLLBACK

## 데이터베이스 스키마

스키마는 `database/schema.sql` 파일을 참조하세요.

## API 문서

서버 실행 후 다음 URL에서 Swagger 문서를 확인할 수 있습니다:

```
http://localhost:3000/api-docs
```

## 라이선스

ISC

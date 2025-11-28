-- igk_todolist_dev 데이터베이스 스키마 정의
-- 이 스키마는 pg 라이브러리를 사용하여 PostgreSQL에 직접 접근합니다
-- Repository 패턴과 Clean Architecture를 적용하여 데이터 접근 계층을 구현했습니다

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS "User" (
    "userId" TEXT PRIMARY KEY,  -- UUID (JavaScript uuid 라이브러리에서 생성)
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 할일 테이블
CREATE TABLE IF NOT EXISTS "Todo" (
    "todoId" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Todo_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("userId")
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 국경일 테이블
CREATE TABLE IF NOT EXISTS "Holiday" (
    "holidayId" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
-- User 테이블
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Todo 테이블 - 성능 최적화를 위한 인덱스 (선택사항)
-- CREATE INDEX IF NOT EXISTS "Todo_userId_status_idx" ON "Todo"("userId", "status");
-- CREATE INDEX IF NOT EXISTS "Todo_dueDate_idx" ON "Todo"("dueDate");
-- CREATE INDEX IF NOT EXISTS "Todo_deletedAt_idx" ON "Todo"("deletedAt");

-- Holiday 테이블 - 성능 최적화를 위한 인덱스 (선택사항)
-- CREATE INDEX IF NOT EXISTS "Holiday_date_idx" ON "Holiday"("date");

-- 주석: 데이터베이스 관리 방법
-- 1. 스키마 변경이 필요한 경우 이 schema.sql 파일을 수정합니다
-- 2. PostgreSQL에 직접 DDL을 실행하거나 마이그레이션 스크립트를 작성합니다
-- 3. Repository 코드를 업데이트합니다
-- 4. Service 레이어에서 비즈니스 로직 검증을 추가합니다
--
-- 참고:
-- - updatedAt은 Repository에서 UPDATE 시 CURRENT_TIMESTAMP로 수동 갱신됩니다
-- - UUID는 애플리케이션(JavaScript uuid 라이브러리)에서 생성됩니다
-- - 데이터 검증(role, status, dueDate >= startDate)은 Service 레이어에서 수행합니다

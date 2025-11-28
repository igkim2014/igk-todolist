-- igk_todolist_dev 데이터베이스 스키마 정의
-- 이 스키마는 Prisma 스키마와 동기화되어 있습니다 (backend/prisma/schema.prisma)
-- Prisma 마이그레이션을 사용하여 실제 DB를 관리하므로 이 파일은 참조용입니다

-- 사용자 테이블
-- Prisma에서 생성한 실제 구조를 반영
CREATE TABLE IF NOT EXISTS "User" (
    "userId" TEXT PRIMARY KEY,  -- Prisma는 String 타입으로 UUID를 저장
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 할일 테이블
CREATE TABLE IF NOT EXISTS "Todo" (
    "todoId" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "startDate" TIMESTAMP(3),  -- Prisma DateTime 매핑 (DATE가 아님)
    "dueDate" TIMESTAMP(3),    -- Prisma DateTime 매핑 (DATE가 아님)
    "status" TEXT NOT NULL DEFAULT 'active',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Todo_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("userId")
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 국경일 테이블
CREATE TABLE IF NOT EXISTS "Holiday" (
    "holidayId" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,  -- Prisma DateTime 매핑
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- 인덱스
-- User 테이블
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Todo 테이블 - Prisma가 자동으로 외래키에 대한 인덱스를 생성하지 않으므로 성능을 위해 추가 권장
-- CREATE INDEX IF NOT EXISTS "Todo_userId_idx" ON "Todo"("userId");

-- 주석: Prisma 마이그레이션 시스템 사용 시
-- 1. prisma/schema.prisma 파일을 수정
-- 2. npx prisma migrate dev --name migration_name 실행
-- 3. 이 schema.sql 파일은 문서화 목적으로만 수동 업데이트
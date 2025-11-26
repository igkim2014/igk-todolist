-- igk_todolist_dev 데이터베이스 스키마 정의

-- 확장 기능 활성화 (UUID 생성용)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS "User" (
    "userId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'user',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 할일 테이블
CREATE TABLE IF NOT EXISTS "Todo" (
    "todoId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "startDate" DATE,
    "dueDate" DATE,
    "status" VARCHAR(20) DEFAULT 'active',
    "isCompleted" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- 국경일 테이블
CREATE TABLE IF NOT EXISTS "Holiday" (
    "holidayId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "isRecurring" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 유니크 인덱스: 이메일
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON "User"("email");

-- 인덱스: 할일 테이블 (userId, status)
CREATE INDEX IF NOT EXISTS idx_todo_user_status ON "Todo"("userId", "status");

-- 인덱스: 할일 테이블 (dueDate)
CREATE INDEX IF NOT EXISTS idx_todo_due_date ON "Todo"("dueDate");

-- 인덱스: 국경일 테이블 (date)
CREATE INDEX IF NOT EXISTS idx_holiday_date ON "Holiday"("date");

-- 외래 키 제약 조건: Todo.userId -> User.userId
ALTER TABLE "Todo"
ADD CONSTRAINT fk_todo_user
FOREIGN KEY ("userId") REFERENCES "User"("userId")
ON DELETE CASCADE;

-- 체크 제약 조건: 마감일 >= 시작일
ALTER TABLE "Todo"
ADD CONSTRAINT chk_due_date_after_start
CHECK ("dueDate" >= "startDate");
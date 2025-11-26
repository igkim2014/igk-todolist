-- ============================================================================
-- WHS-TodoList Database Schema (PostgreSQL)
-- ============================================================================
-- Version: 1.0
-- Created: 2025-11-26
-- Author: Claude
-- Database: PostgreSQL 15+
-- Reference: docs/6-erd.md
-- ============================================================================

-- ============================================================================
-- 1. Extensions
-- ============================================================================

-- UUID 생성을 위한 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. ENUM Types
-- ============================================================================

-- 사용자 역할 ENUM
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 할일 상태 ENUM
CREATE TYPE todo_status AS ENUM ('active', 'completed', 'deleted');

-- ============================================================================
-- 3. Tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 User Table (사용자)
-- ----------------------------------------------------------------------------
-- Description: 사용자 계정 정보를 저장하는 테이블
-- Business Rules:
--   - [BR-01] 인증된 사용자만 시스템 접근 가능
--   - [BR-02] 사용자는 자신의 할일만 조회/수정/삭제 가능
--   - [BR-04] 관리자(role='admin')만 국경일 추가/수정 권한
-- ----------------------------------------------------------------------------

CREATE TABLE "User" (
    -- Primary Key
    "userId"    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- User Credentials
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,

    -- User Profile
    username    VARCHAR(100) NOT NULL,
    role        user_role NOT NULL DEFAULT 'user',

    -- Timestamps
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Comments for User table
COMMENT ON TABLE "User" IS '사용자 계정 정보';
COMMENT ON COLUMN "User"."userId" IS '사용자 고유 식별자 (UUID)';
COMMENT ON COLUMN "User".email IS '로그인에 사용되는 이메일 주소 (고유)';
COMMENT ON COLUMN "User".password IS 'bcrypt로 해시된 비밀번호 (salt rounds: 10)';
COMMENT ON COLUMN "User".username IS '사용자 표시 이름';
COMMENT ON COLUMN "User".role IS '사용자 역할 (user: 일반 사용자, admin: 관리자)';
COMMENT ON COLUMN "User"."createdAt" IS '계정 생성 일시';
COMMENT ON COLUMN "User"."updatedAt" IS '최종 수정 일시 (자동 업데이트)';

-- ----------------------------------------------------------------------------
-- 3.2 Todo Table (할일)
-- ----------------------------------------------------------------------------
-- Description: 사용자별 할일 항목을 저장하는 테이블
-- Business Rules:
--   - [BR-02] 사용자는 자신의 할일만 조회/수정/삭제 가능
--   - [BR-05] 할일 삭제 시 휴지통으로 이동 (소프트 삭제)
--   - [BR-06] 휴지통의 할일은 복원 가능
--   - [BR-07] 영구 삭제 시 DB에서 완전히 제거
--   - [BR-08] 할일 완료 시 isCompleted=true, status='completed'
--   - [BR-12] 만료일은 시작일과 같거나 이후여야 함
--   - [BR-13] 만료일 지난 할일은 UI에서 시각적 구분
-- ----------------------------------------------------------------------------

CREATE TABLE "Todo" (
    -- Primary Key
    "todoId"      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Foreign Key (User)
    "userId"      UUID NOT NULL,

    -- Todo Content
    title         VARCHAR(200) NOT NULL,
    content       TEXT,

    -- Date Range
    "startDate"   DATE,
    "dueDate"     DATE,

    -- Status
    status        todo_status NOT NULL DEFAULT 'active',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    -- Timestamps
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt"   TIMESTAMP WITH TIME ZONE,

    -- Foreign Key Constraint
    CONSTRAINT "FK_Todo_User"
        FOREIGN KEY ("userId")
        REFERENCES "User"("userId")
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Check Constraint: dueDate >= startDate
    CONSTRAINT "CHK_Todo_DateRange"
        CHECK (
            "dueDate" IS NULL OR
            "startDate" IS NULL OR
            "dueDate" >= "startDate"
        )
);

-- Comments for Todo table
COMMENT ON TABLE "Todo" IS '사용자별 할일 항목';
COMMENT ON COLUMN "Todo"."todoId" IS '할일 고유 식별자 (UUID)';
COMMENT ON COLUMN "Todo"."userId" IS '할일 소유자 ID (User 참조)';
COMMENT ON COLUMN "Todo".title IS '할일 제목 (필수, 최대 200자)';
COMMENT ON COLUMN "Todo".content IS '할일 상세 내용 (선택)';
COMMENT ON COLUMN "Todo"."startDate" IS '할일 시작일 (선택)';
COMMENT ON COLUMN "Todo"."dueDate" IS '할일 만료일 (선택, startDate 이후여야 함)';
COMMENT ON COLUMN "Todo".status IS '할일 상태 (active: 활성, completed: 완료, deleted: 삭제)';
COMMENT ON COLUMN "Todo"."isCompleted" IS '완료 여부 플래그';
COMMENT ON COLUMN "Todo"."createdAt" IS '할일 생성 일시';
COMMENT ON COLUMN "Todo"."updatedAt" IS '최종 수정 일시 (자동 업데이트)';
COMMENT ON COLUMN "Todo"."deletedAt" IS '소프트 삭제 일시 (휴지통 이동 시각)';

-- ----------------------------------------------------------------------------
-- 3.3 Holiday Table (국경일)
-- ----------------------------------------------------------------------------
-- Description: 공통 국경일 정보를 저장하는 테이블
-- Business Rules:
--   - [BR-03] 모든 인증된 사용자가 조회 가능
--   - [BR-04] 관리자(role='admin')만 추가/수정 권한
--   - [BR-09] 관리자만 추가/수정 가능
--   - [BR-10] 국경일은 삭제 불가
--   - [BR-11] 매년 반복되는 일정 지원
-- ----------------------------------------------------------------------------

CREATE TABLE "Holiday" (
    -- Primary Key
    "holidayId"   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Holiday Information
    title         VARCHAR(100) NOT NULL,
    date          DATE NOT NULL,
    description   TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Comments for Holiday table
COMMENT ON TABLE "Holiday" IS '공통 국경일 정보';
COMMENT ON COLUMN "Holiday"."holidayId" IS '국경일 고유 식별자 (UUID)';
COMMENT ON COLUMN "Holiday".title IS '국경일 이름 (예: 신정, 설날, 광복절)';
COMMENT ON COLUMN "Holiday".date IS '국경일 날짜';
COMMENT ON COLUMN "Holiday".description IS '국경일 설명 (선택)';
COMMENT ON COLUMN "Holiday"."isRecurring" IS '매년 반복 여부 (true: 매년 반복, false: 일회성)';
COMMENT ON COLUMN "Holiday"."createdAt" IS '국경일 생성 일시';
COMMENT ON COLUMN "Holiday"."updatedAt" IS '최종 수정 일시 (자동 업데이트)';

-- ============================================================================
-- 4. Indexes
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 User Indexes
-- ----------------------------------------------------------------------------

-- Email index for login (UNIQUE constraint creates index automatically)
-- CREATE UNIQUE INDEX "UK_User_Email" ON "User"(email);  -- Already created by UNIQUE constraint

-- Role index for admin user queries
CREATE INDEX "IDX_User_Role" ON "User"(role);

-- ----------------------------------------------------------------------------
-- 4.2 Todo Indexes
-- ----------------------------------------------------------------------------

-- Composite index for user-specific status queries (most common query pattern)
CREATE INDEX "IDX_Todo_UserId_Status" ON "Todo"("userId", status);

-- Due date index for sorting and filtering by deadline
CREATE INDEX "IDX_Todo_DueDate" ON "Todo"("dueDate");

-- Deleted date index for trash queries and soft delete filtering
CREATE INDEX "IDX_Todo_DeletedAt" ON "Todo"("deletedAt");

-- ----------------------------------------------------------------------------
-- 4.3 Holiday Indexes
-- ----------------------------------------------------------------------------

-- Date index for date-based queries and sorting
CREATE INDEX "IDX_Holiday_Date" ON "Holiday"(date);

-- ============================================================================
-- 5. Triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Updated Timestamp Trigger Function
-- ----------------------------------------------------------------------------
-- Description: Automatically updates 'updatedAt' column when record is modified
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.2 Apply Triggers to Tables
-- ----------------------------------------------------------------------------

-- User table trigger
CREATE TRIGGER "TR_User_UpdatedAt"
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Todo table trigger
CREATE TRIGGER "TR_Todo_UpdatedAt"
    BEFORE UPDATE ON "Todo"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Holiday table trigger
CREATE TRIGGER "TR_Holiday_UpdatedAt"
    BEFORE UPDATE ON "Holiday"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. Initial Data (Seed)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 6.1 Admin User (Optional)
-- ----------------------------------------------------------------------------
-- Note: Password should be hashed using bcrypt before insertion
-- This is a placeholder - DO NOT use in production without proper hashing
-- Default password: 'admin123' (MUST be changed after first login)
-- ----------------------------------------------------------------------------

-- INSERT INTO "User" ("userId", email, password, username, role)
-- VALUES (
--     uuid_generate_v4(),
--     'admin@example.com',
--     '$2b$10$PLACEHOLDER_HASH_REPLACE_ME',  -- bcrypt hash of 'admin123'
--     'System Admin',
--     'admin'
-- );

-- ----------------------------------------------------------------------------
-- 6.2 Korean National Holidays (2025)
-- ----------------------------------------------------------------------------
-- Note: This is sample data for 2025
-- For production, consider using API or manual admin input
-- ----------------------------------------------------------------------------

INSERT INTO "Holiday" (title, date, description, "isRecurring") VALUES
    ('신정', '2025-01-01', '새해 첫날', true),
    ('설날', '2025-01-28', '음력 1월 1일 (전날)', true),
    ('설날', '2025-01-29', '음력 1월 1일', true),
    ('설날', '2025-01-30', '음력 1월 1일 (다음날)', true),
    ('삼일절', '2025-03-01', '3.1 독립운동 기념일', true),
    ('어린이날', '2025-05-05', '어린이날', true),
    ('석가탄신일', '2025-05-05', '음력 4월 8일 (부처님 오신 날)', true),
    ('현충일', '2025-06-06', '나라를 위해 희생한 분들을 기리는 날', true),
    ('광복절', '2025-08-15', '대한민국 독립 기념일', true),
    ('추석', '2025-10-05', '음력 8월 15일 (전날)', true),
    ('추석', '2025-10-06', '음력 8월 15일', true),
    ('추석', '2025-10-07', '음력 8월 15일 (다음날)', true),
    ('개천절', '2025-10-03', '단군왕검이 나라를 세운 날', true),
    ('한글날', '2025-10-09', '훈민정음 반포 기념일', true),
    ('크리스마스', '2025-12-25', '성탄절', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. Performance Optimization Notes
-- ============================================================================

-- Expected data volume (based on PRD):
--   - Users: ~1,000
--   - Todos: ~20,000 (avg 20 per user)
--   - Holidays: ~50 (yearly recurring events)
--
-- Index strategy:
--   - User.email: UNIQUE index for fast login queries
--   - User.role: B-tree index for admin filtering
--   - Todo.(userId, status): Composite index for user-specific active/completed queries
--   - Todo.dueDate: B-tree index for deadline sorting
--   - Todo.deletedAt: B-tree index for trash filtering (NULL = active)
--   - Holiday.date: B-tree index for date range queries
--
-- Query optimization tips:
--   1. Always use indexes when filtering by userId, status, or dates
--   2. Use EXPLAIN ANALYZE to verify index usage
--   3. Consider partitioning Todo table by year if data exceeds 100K rows
--   4. Use connection pooling (e.g., pgBouncer) for high concurrency

-- ============================================================================
-- 8. Maintenance Queries
-- ============================================================================

-- Check table sizes
-- SELECT
--     schemaname,
--     tablename,
--     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     idx_scan as index_scans,
--     pg_size_pretty(pg_relation_size(indexrelid)) as index_size
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- Vacuum analyze (run periodically for performance)
-- VACUUM ANALYZE "User";
-- VACUUM ANALYZE "Todo";
-- VACUUM ANALYZE "Holiday";

-- ============================================================================
-- End of Schema
-- ============================================================================

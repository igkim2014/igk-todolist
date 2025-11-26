-- 2025년 주요 국경일 데이터 삽입
-- Task 1.4: 초기 데이터 삽입 (국경일)

-- 대한민국 2025년 주요 국경일 (https://www.holidayscalendar.kr/ko/holidays/2025/kr/)

-- 신정
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('신정', '2025-01-01', 'New Year''s Day', TRUE);

-- 설날 (설날 연휴)
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('설날', '2025-01-29', 'Lunar New Year''s Day', FALSE);

INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('설날 대체공휴일', '2025-01-30', 'Alternative holiday for Lunar New Year', FALSE);

-- 삼일절
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('삼일절', '2025-03-01', 'Independence Movement Day', TRUE);

-- 어린이날
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('어린이날', '2025-05-05', 'Children''s Day', TRUE);

-- 석가탄신일
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('석가탄신일', '2025-05-13', 'Buddha''s Birthday', FALSE);

-- 현충일
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('현충일', '2025-06-06', 'Memorial Day', TRUE);

-- 광복절
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('광복절', '2025-08-15', 'Liberation Day', TRUE);

-- 추석 (추석 연휴)
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('추석', '2025-10-29', 'Chuseok (Korean Thanksgiving)', FALSE);

-- 개천절
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('개천절', '2025-10-03', 'National Foundation Day', TRUE);

-- 한글날
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('한글날', '2025-10-09', 'Hangeul Day', TRUE);

-- 크리스마스
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring")
VALUES ('크리스마스', '2025-12-25', 'Christmas Day', TRUE);
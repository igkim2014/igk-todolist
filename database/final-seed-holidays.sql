-- Clear existing holiday data
DELETE FROM "Holiday";

-- Insert 2025 Korean holidays with correct dates and recurring flags
INSERT INTO "Holiday" ("title", "date", "description", "isRecurring") VALUES 
('신정', '2025-01-01'::date, 'New Year''s Day', TRUE),
('설날', '2025-01-29'::date, 'Lunar New Year''s Day', FALSE),
('설날 대체공휴일', '2025-01-30'::date, 'Alternative holiday for Lunar New Year', FALSE),
('삼일절', '2025-03-01'::date, 'Independence Movement Day', TRUE),
('어린이날', '2025-05-05'::date, 'Children''s Day', TRUE),
('석가탄신일', '2025-05-13'::date, 'Buddha''s Birthday', FALSE),
('현충일', '2025-06-06'::date, 'Memorial Day', TRUE),
('광복절', '2025-08-15'::date, 'Liberation Day', TRUE),
('추석', '2025-10-29'::date, 'Chuseok (Korean Thanksgiving)', FALSE),
('개천절', '2025-10-03'::date, 'National Foundation Day', TRUE),
('한글날', '2025-10-09'::date, 'Hangeul Day', TRUE),
('크리스마스', '2025-12-25'::date, 'Christmas Day', TRUE);
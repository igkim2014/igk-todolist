-- Verification SQL to check holiday data
-- This will be executed directly in PostgreSQL

-- Count total holidays
SELECT COUNT(*) as total_holidays FROM "Holiday";

-- Check holiday details (with encoded output for verification)
SELECT 
    "holidayId",
    "title",
    "date",
    "description",
    "isRecurring"
FROM "Holiday"
ORDER BY "date";

-- Check recurring vs non-recurring
SELECT 
    "isRecurring",
    COUNT(*) as count
FROM "Holiday"
GROUP BY "isRecurring";
const { Client } = require('pg');
require('dotenv').config();

// Set up the client with specific encoding options
const client = new Client({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    options: '-c client_encoding=UTF8'
});

async function insertFinalHolidayData() {
    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database with UTF8 encoding.');

        // Set client encoding explicitly
        await client.query('SET client_encoding = \'UTF8\';');
        console.log('UTF8 encoding set for client.');

        // Clear existing holiday data
        await client.query('DELETE FROM "Holiday";');
        console.log('Cleared existing holiday data.');

        // Insert the Korean holidays with explicit date handling
        const query = `
            INSERT INTO "Holiday" ("title", "date", "description", "isRecurring") VALUES 
            ($1, $2, $3, $4),
            ($5, $6, $7, $8),
            ($9, $10, $11, $12),
            ($13, $14, $15, $16),
            ($17, $18, $19, $20),
            ($21, $22, $23, $24),
            ($25, $26, $27, $28),
            ($29, $30, $31, $32),
            ($33, $34, $35, $36),
            ($37, $38, $39, $40),
            ($41, $42, $43, $44),
            ($45, $46, $47, $48);
        `;

        const values = [
            // 신정
            '신정', '2025-01-01', 'New Year\'s Day', true,
            // 설날
            '설날', '2025-01-29', 'Lunar New Year\'s Day', false,
            // 설날 대체공휴일
            '설날 대체공휴일', '2025-01-30', 'Alternative holiday for Lunar New Year', false,
            // 삼일절
            '삼일절', '2025-03-01', 'Independence Movement Day', true,
            // 어린이날
            '어린이날', '2025-05-05', 'Children\'s Day', true,
            // 석가탄신일
            '석가탄신일', '2025-05-13', 'Buddha\'s Birthday', false,
            // 현충일
            '현충일', '2025-06-06', 'Memorial Day', true,
            // 광복절
            '광복절', '2025-08-15', 'Liberation Day', true,
            // 추석
            '추석', '2025-10-29', 'Chuseok (Korean Thanksgiving)', false,
            // 개천절
            '개천절', '2025-10-03', 'National Foundation Day', true,
            // 한글날
            '한글날', '2025-10-09', 'Hangeul Day', true,
            // 크리스마스
            '크리스마스', '2025-12-25', 'Christmas Day', true
        ];

        await client.query(query, values);
        console.log('✅ Final holiday data inserted successfully with proper encoding!');

        // Verify the data was inserted with correct dates
        const result = await client.query(`
            SELECT "title", "date", "description", "isRecurring" 
            FROM "Holiday" 
            ORDER BY "date";
        `);
        
        console.log(`\n${result.rows.length} holidays inserted with proper data:`);
        result.rows.forEach(holiday => {
            console.log(`- ${holiday.date.toISOString().split('T')[0]}: ${holiday.title} (${holiday.description}) [Recurring: ${holiday.isRecurring}]`);
        });

        // Verify we have the expected number of holidays
        if (result.rows.length === 12) {
            console.log(`\n✅ All 12 holidays correctly inserted`);
        } else {
            console.log(`\n❌ Expected 12 holidays, but found ${result.rows.length}`);
        }

        return true;
    } catch (err) {
        console.error('❌ Error inserting final holiday data:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

// Run the final holiday data insertion
insertFinalHolidayData().then(success => {
    if (success) {
        console.log('\n🎉 Final holiday data insertion completed successfully!');
    } else {
        console.log('\n💥 Final holiday data insertion failed!');
        process.exit(1);
    }
});
require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function insertCorrectHolidayData() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database.');

        // Clear existing holiday data
        await client.query('DELETE FROM "Holiday";');
        console.log('Cleared existing holiday data.');

        // Insert the correct 2025 Korean holidays with proper dates
        const holidays = [
            {
                title: '신정',
                date: '2025-01-01',
                description: 'New Year\'s Day',
                isRecurring: false
            },
            {
                title: '설날',
                date: '2025-01-29',
                description: 'Lunar New Year\'s Day',
                isRecurring: false
            },
            {
                title: '설날 대체공휴일',
                date: '2025-01-30',
                description: 'Alternative holiday for Lunar New Year',
                isRecurring: false
            },
            {
                title: '삼일절',
                date: '2025-03-01',
                description: 'Independence Movement Day',
                isRecurring: false
            },
            {
                title: '어린이날',
                date: '2025-05-05',
                description: 'Children\'s Day',
                isRecurring: false
            },
            {
                title: '석가탄신일',
                date: '2025-05-13',
                description: 'Buddha\'s Birthday',
                isRecurring: false
            },
            {
                title: '현충일',
                date: '2025-06-06',
                description: 'Memorial Day',
                isRecurring: false
            },
            {
                title: '광복절',
                date: '2025-08-15',
                description: 'Liberation Day',
                isRecurring: false
            },
            {
                title: '추석',
                date: '2025-10-29',
                description: 'Chuseok (Korean Thanksgiving)',
                isRecurring: false
            },
            {
                title: '개천절',
                date: '2025-10-03',
                description: 'National Foundation Day',
                isRecurring: false
            },
            {
                title: '한글날',
                date: '2025-10-09',
                description: 'Hangeul Day',
                isRecurring: false
            },
            {
                title: '크리스마스',
                date: '2025-12-25',
                description: 'Christmas Day',
                isRecurring: false
            }
        ];

        console.log('Inserting correct holiday data...');
        for (const holiday of holidays) {
            await client.query(`
                INSERT INTO "Holiday" ("title", "date", "description", "isRecurring") 
                VALUES ($1, $2, $3, $4)
            `, [holiday.title, holiday.date, holiday.description, holiday.isRecurring]);
        }
        console.log(`✅ ${holidays.length} holiday records inserted successfully!`);

        // Verify the data was inserted with correct dates
        const result = await client.query(`
            SELECT "title", "date", "description", "isRecurring" 
            FROM "Holiday" 
            ORDER BY "date";
        `);
        
        console.log(`\n${result.rows.length} holidays now in database with correct dates:`);
        result.rows.forEach(holiday => {
            console.log(`- ${holiday.date}: ${holiday.title} (${holiday.description}) [Recurring: ${holiday.isRecurring}]`);
        });

        // Check if we have at least 10 holidays as required
        if (result.rows.length >= 10) {
            console.log(`\n✅ At least 10 holidays inserted (${result.rows.length})`);
        } else {
            console.log(`\n❌ Only ${result.rows.length} holidays inserted (need at least 10)`);
        }

        // Verify specific dates are correct
        const expectedDates = ['2025-01-01', '2025-01-29', '2025-01-30', '2025-03-01', '2025-05-05', '2025-05-13', '2025-06-06', '2025-08-15', '2025-10-03', '2025-10-09', '2025-10-29', '2025-12-25'];
        const actualDates = result.rows.map(h => h.date);
        const datesMatch = expectedDates.every(date => actualDates.includes(date)) && 
                          actualDates.every(date => expectedDates.includes(date));
        
        if (datesMatch) {
            console.log('✅ All expected dates are correct');
        } else {
            console.log('❌ Some dates do not match expectations');
            console.log('Expected:', expectedDates);
            console.log('Actual:', actualDates);
        }

        return true;
    } catch (err) {
        console.error('❌ Error inserting correct holiday data:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

// Run the correct holiday data insertion
insertCorrectHolidayData().then(success => {
    if (success) {
        console.log('\n🎉 Correct holiday data insertion completed successfully!');
    } else {
        console.log('\n💥 Correct holiday data insertion failed!');
        process.exit(1);
    }
});
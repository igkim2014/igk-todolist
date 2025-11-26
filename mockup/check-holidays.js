require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function checkHolidayData() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database.');

        // Query holiday data directly
        const result = await client.query(`
            SELECT "holidayId", "title", "date", "description", "isRecurring" 
            FROM "Holiday" 
            ORDER BY "date";
        `);
        
        console.log(`\n${result.rows.length} holidays in database:`);
        result.rows.forEach(holiday => {
            const dateStr = holiday.date.toISOString().split('T')[0];
            console.log(`ID: ${holiday.holidayId} | Date: ${dateStr} | Title: ${holiday.title} | Description: ${holiday.description} | Recurring: ${holiday.isRecurring}`);
        });

        return true;
    } catch (err) {
        console.error('❌ Error querying holiday data:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

// Run the holiday data check
checkHolidayData().then(success => {
    if (success) {
        console.log('\n🎉 Holiday data check completed successfully!');
    } else {
        console.log('\n💥 Holiday data check failed!');
        process.exit(1);
    }
});
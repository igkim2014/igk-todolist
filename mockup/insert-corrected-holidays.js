require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

// Read the corrected holiday seed file
const seedPath = path.join(__dirname, '..', 'database', 'seed-holidays.sql');
const seedSQL = fs.readFileSync(seedPath, 'utf8');

async function insertCorrectedHolidayData() {
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

        console.log('Inserting corrected holiday data...');
        await client.query(seedSQL);
        console.log('✅ Corrected holiday data inserted successfully!');

        // Verify the data was inserted with correct dates and recurring flags
        const result = await client.query(`
            SELECT "title", "date", "description", "isRecurring" 
            FROM "Holiday" 
            ORDER BY "date";
        `);
        
        console.log(`\n${result.rows.length} holidays now in database:`);
        result.rows.forEach(holiday => {
            console.log(`- ${holiday.date.toISOString().split('T')[0]}: ${holiday.title} (${holiday.description}) [Recurring: ${holiday.isRecurring}]`);
        });

        // Check if we have at least 10 holidays as required
        if (result.rows.length >= 10) {
            console.log(`\n✅ At least 10 holidays inserted (${result.rows.length})`);
        } else {
            console.log(`\n❌ Only ${result.rows.length} holidays inserted (need at least 10)`);
        }

        // Verify specific recurring flags are correct
        const recurringHolidays = result.rows.filter(h => h.isRecurring);
        const nonRecurringHolidays = result.rows.filter(h => !h.isRecurring);
        
        console.log(`\nRecurring holidays (${recurringHolidays.length}):`);
        recurringHolidays.forEach(h => {
            console.log(`- ${h.title} (${h.date.toISOString().split('T')[0]})`);
        });
        
        console.log(`\nNon-recurring holidays (${nonRecurringHolidays.length}):`);
        nonRecurringHolidays.forEach(h => {
            console.log(`- ${h.title} (${h.date.toISOString().split('T')[0]})`);
        });

        return true;
    } catch (err) {
        console.error('❌ Error inserting corrected holiday data:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

// Run the corrected holiday data insertion
insertCorrectedHolidayData().then(success => {
    if (success) {
        console.log('\n🎉 Corrected holiday data insertion completed successfully!');
    } else {
        console.log('\n💥 Corrected holiday data insertion failed!');
        process.exit(1);
    }
});
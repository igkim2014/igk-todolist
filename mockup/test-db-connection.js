require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function testConnection() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Attempting to connect to PostgreSQL database...');
        await client.connect();
        console.log('✅ Successfully connected to the database!');
        
        // Run a simple query to test the connection
        const result = await client.query('SELECT NOW() as now');
        console.log('Database server time:', result.rows[0].now);
        
        return true;
    } catch (err) {
        console.error('❌ Failed to connect to the database:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

// Run the test
testConnection().then(success => {
    if (success) {
        console.log('\n🎉 Database connection test completed successfully!');
    } else {
        console.log('\n💥 Database connection test failed!');
        process.exit(1);
    }
});
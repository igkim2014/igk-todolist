require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function createDatabase() {
    // Connect to the default postgres database first
    const defaultClient = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
    });

    try {
        console.log('Connecting to PostgreSQL...');
        await defaultClient.connect();
        console.log('Connected to default postgres database.');

        // Check if the database already exists
        const dbCheckQuery = `
            SELECT datname 
            FROM pg_catalog.pg_database 
            WHERE lower(datname) = lower('igk_todolist_dev');
        `;
        
        const result = await defaultClient.query(dbCheckQuery);
        
        if (result.rows.length > 0) {
            console.log('Database igk_todolist_dev already exists.');
        } else {
            // Create the new database
            await defaultClient.query('CREATE DATABASE igk_todolist_dev');
            console.log('✅ Database igk_todolist_dev created successfully!');
        }
        
        return true;
    } catch (err) {
        console.error('❌ Error creating database:', err.message);
        return false;
    } finally {
        await defaultClient.end();
        console.log('Connection closed.');
    }
}

// Run the database creation
createDatabase().then(success => {
    if (success) {
        console.log('\n🎉 Database creation process completed successfully!');
    } else {
        console.log('\n💥 Database creation process failed!');
        process.exit(1);
    }
});
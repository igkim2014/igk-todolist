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

// Read the schema file
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

async function applySchema() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database.');

        console.log('Applying schema...');
        await client.query(schemaSQL);
        console.log('✅ Schema applied successfully!');
        
        // Verify tables were created
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);
        
        console.log('\nCreated tables:');
        tables.rows.forEach(table => {
            console.log(`- ${table.table_name}`);
        });
        
        return true;
    } catch (err) {
        console.error('❌ Error applying schema:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

// Run the schema application
applySchema().then(success => {
    if (success) {
        console.log('\n🎉 Schema application completed successfully!');
    } else {
        console.log('\n💥 Schema application failed!');
        process.exit(1);
    }
});
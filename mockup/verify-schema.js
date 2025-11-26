require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function verifySchema() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database.');

        // Check if all 3 tables exist
        console.log('\n1. Checking if all 3 tables exist...');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);
        
        const tableNames = tables.rows.map(table => table.table_name);
        const expectedTables = ['User', 'Todo', 'Holiday'];
        const allTablesExist = expectedTables.every(table => tableNames.includes(table));
        
        console.log(`   Tables found: ${tableNames.join(', ')}`);
        console.log(`   All required tables exist: ${allTablesExist ? '✅' : '❌'}`);

        // Check if indices were created
        console.log('\n2. Checking if indices were created...');
        const indices = await client.query(`
            SELECT indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename IN ('User', 'Todo', 'Holiday');
        `);
        
        const indexNames = indices.rows.map(index => index.indexname);
        console.log(`   Indices found: ${indexNames.join(', ')}`);
        
        // Expected indices based on schema
        const expectedIndices = [
            'idx_user_email',
            'idx_todo_user_status', 
            'idx_todo_due_date',
            'idx_holiday_date',
            // The primary key indices would be named like 'user_pkey', 'todo_pkey', 'holiday_pkey'
        ];
        
        const primaryIndices = indexNames.filter(index => 
            index.includes('_pkey') || index.includes('user_userId') || 
            index.includes('todo_todoId') || index.includes('holiday_holidayId'));
        const matchingIndices = expectedIndices.filter(expected => 
            indexNames.some(actual => actual.includes(expected.replace('idx_', '').replace('_', '')) || actual === expected)
        );
        
        console.log(`   Expected indices found: ${matchingIndices.length}/${expectedIndices.length}`);
        console.log(`   Primary key indices found: ${primaryIndices.length >= 3 ? '✅' : '❌'}`);

        // Test the CHECK constraint: dueDate >= startDate
        console.log('\n3. Testing CHECK constraint (dueDate >= startDate)...');
        try {
            await client.query(`
                INSERT INTO "Todo" ("userId", "title", "startDate", "dueDate") 
                VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Test Todo', '2025-12-31', '2025-01-01');
            `);
            console.log('   ❌ CHECK constraint NOT working - should have failed for dueDate < startDate');
        } catch (error) {
            if (error.message.includes('chk_due_date_after_start') || error.message.includes('check')) {
                console.log('   ✅ CHECK constraint is working - dueDate < startDate properly rejected');
            } else {
                console.log('   ❓ CHECK constraint may be working - but different error:', error.message);
            }
        }

        // Clean up the test data if it was inserted
        try {
            await client.query(`DELETE FROM "Todo" WHERE "title" = 'Test Todo';`);
        } catch (error) {
            // If there was an error deleting, it's likely because the insert was blocked, which is fine
        }

        // Test the UNIQUE constraint: User.email
        console.log('\n4. Testing UNIQUE constraint (User.email)...');
        try {
            await client.query(`
                INSERT INTO "User" ("email", "password", "username") 
                VALUES ('test@example.com', 'password', 'testuser');
            `);
            
            // Try to insert another user with the same email
            await client.query(`
                INSERT INTO "User" ("email", "password", "username") 
                VALUES ('test@example.com', 'password2', 'testuser2');
            `);
            
            // If we reach this point, the unique constraint didn't work
            console.log('   ❌ UNIQUE constraint NOT working - should have failed for duplicate email');
            
            // Clean up since we inserted two records
            await client.query(`DELETE FROM "User" WHERE "email" = 'test@example.com';`);
        } catch (error) {
            if (error.message.includes('idx_user_email') || error.message.includes('unique')) {
                console.log('   ✅ UNIQUE constraint is working - duplicate email properly rejected');
            } else {
                console.log('   ❓ UNIQUE constraint may be working - but different error:', error.message);
            }
        }

        return true;
    } catch (err) {
        console.error('❌ Error during schema verification:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('\nConnection closed.');
    }
}

// Run the schema verification
verifySchema().then(success => {
    if (success) {
        console.log('\n🎉 Schema verification completed!');
    } else {
        console.log('\n💥 Schema verification failed!');
        process.exit(1);
    }
});
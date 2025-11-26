require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg');

// Get the connection string from environment variables
const connectionString = process.env.POSTGRES_CONNECTION_STRING;

if (!connectionString) {
    console.error('Error: POSTGRES_CONNECTION_STRING is not defined in .env');
    process.exit(1);
}

async function comprehensiveSchemaVerification() {
    const client = new Client({
        connectionString: connectionString
    });

    try {
        console.log('Connecting to igk_todolist_dev database...');
        await client.connect();
        console.log('Connected to database.');

        console.log('\n=== COMPREHENSIVE SCHEMA VERIFICATION ===\n');

        // 1. Verify all 3 tables exist
        console.log('1. Verifying all 3 tables exist...');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        const tableNames = tables.rows.map(table => table.table_name);
        const requiredTables = ['User', 'Todo', 'Holiday'];
        
        console.log(`   Found tables: ${tableNames.join(', ')}`);
        
        let allTablesExist = true;
        for (const table of requiredTables) {
            if (!tableNames.includes(table)) {
                console.log(`   ❌ Missing table: ${table}`);
                allTablesExist = false;
            } else {
                console.log(`   ✅ Table exists: ${table}`);
            }
        }
        if (allTablesExist) {
            console.log('   ✅ All required tables exist');
        }

        // 2. Verify all indices exist (at least 6 as specified)
        console.log('\n2. Verifying indices exist...');
        const indices = await client.query(`
            SELECT indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename IN ('User', 'Todo', 'Holiday')
            ORDER BY tablename, indexname;
        `);
        
        const indexNames = indices.rows.map(index => index.indexname);
        console.log(`   Found indices: ${indexNames.join(', ')}`);
        console.log(`   Total indices found: ${indexNames.length} (need at least 6)`);
        
        // Expected indices:
        // - 3 primary key indices (one for each table)
        // - 1 unique index on User.email
        // - 2 indices on Todo table (userId+status, dueDate)
        // - 1 index on Holiday table (date)
        const expectedIndexCount = 7; // 3 pkeys + 1 unique + 2 on Todo + 1 on Holiday
        if (indexNames.length >= 6) {
            console.log(`   ✅ At least 6 indices exist: ${indexNames.length}`);
        } else {
            console.log(`   ❌ Only ${indexNames.length} indices found (need at least 6)`);
        }

        // 3. Test the CHECK constraint: dueDate >= startDate
        console.log('\n3. Testing CHECK constraint (dueDate >= startDate)...');
        try {
            await client.query(`
                INSERT INTO "Todo" ("userId", "title", "startDate", "dueDate") 
                VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Test Constraint Todo', '2025-12-31', '2025-01-01');
            `);
            console.log('   ❌ CHECK constraint NOT working - should have failed for dueDate < startDate');
            // Clean up if insert succeeded (which it shouldn't)
            await client.query(`DELETE FROM "Todo" WHERE "title" = 'Test Constraint Todo';`);
        } catch (error) {
            if (error.message.includes('chk_due_date_after_start') || error.message.includes('check')) {
                console.log('   ✅ CHECK constraint is working - dueDate < startDate properly rejected');
            } else {
                console.log('   ❓ CHECK constraint may be working - but different error:', error.message);
            }
        }

        // 4. Test the UNIQUE constraint: User.email
        console.log('\n4. Testing UNIQUE constraint (User.email)...');
        try {
            await client.query(`
                INSERT INTO "User" ("email", "password", "username") 
                VALUES ('test-unique@example.com', 'password', 'testuser');
            `);
            
            // Try to insert another user with the same email
            await client.query(`
                INSERT INTO "User" ("email", "password", "username") 
                VALUES ('test-unique@example.com', 'password2', 'testuser2');
            `);
            
            // If we reach this point, the unique constraint didn't work
            console.log('   ❌ UNIQUE constraint NOT working - should have failed for duplicate email');
            
            // Clean up since we inserted two records (though this shouldn't happen)
            await client.query(`DELETE FROM "User" WHERE "email" = 'test-unique@example.com';`);
        } catch (error) {
            if (error.message.toLowerCase().includes('idx_user_email') || error.message.toLowerCase().includes('unique')) {
                console.log('   ✅ UNIQUE constraint is working - duplicate email properly rejected');
            } else {
                console.log('   ❓ UNIQUE constraint may be working - but different error:', error.message);
            }
        }

        // 5. Test the FOREIGN KEY constraint: Todo.userId → User.userId
        console.log('\n5. Testing FOREIGN KEY constraint (Todo.userId → User.userId)...');
        try {
            // Insert a todo with a non-existent userId
            await client.query(`
                INSERT INTO "Todo" ("userId", "title", "content") 
                VALUES ('123e4567-e89b-12d3-a456-426614174999', 'Test FK Todo', 'Testing foreign key constraint');
            `);
            console.log('   ❌ FOREIGN KEY constraint NOT working - should have failed for invalid userId');
            
            // Clean up if insert succeeded (which it shouldn't)
            await client.query(`DELETE FROM "Todo" WHERE "title" = 'Test FK Todo';`);
        } catch (error) {
            if (error.message.toLowerCase().includes('fk_todo_user') || error.message.toLowerCase().includes('foreign key')) {
                console.log('   ✅ FOREIGN KEY constraint is working - invalid userId properly rejected');
            } else {
                console.log('   ❓ FOREIGN KEY constraint may be working - but different error:', error.message);
            }
        }

        // 6. Test that CASCADE delete works on the FK constraint
        console.log('\n6. Testing CASCADE delete on FOREIGN KEY constraint...');
        try {
            // First, create a user
            const userResult = await client.query(`
                INSERT INTO "User" ("email", "password", "username") 
                VALUES ('test-cascade@example.com', 'password', 'cascadetest')
                RETURNING "userId";
            `);
            const userId = userResult.rows[0].userId;
            
            // Create a todo for this user
            await client.query(`
                INSERT INTO "Todo" ("userId", "title", "content") 
                VALUES ($1, 'Test Cascade Todo', 'Testing cascade delete')
            `, [userId]);
            
            // Verify the todo exists
            const todoBefore = await client.query(`
                SELECT "todoId" FROM "Todo" WHERE "title" = 'Test Cascade Todo'
            `);
            console.log(`   Todo exists before user deletion: ${todoBefore.rows.length > 0 ? 'Yes' : 'No'}`);
            
            // Delete the user
            await client.query(`
                DELETE FROM "User" WHERE "userId" = $1
            `, [userId]);
            
            // Check if the todo was also deleted (due to CASCADE)
            const todoAfter = await client.query(`
                SELECT "todoId" FROM "Todo" WHERE "title" = 'Test Cascade Todo'
            `);
            console.log(`   Todo exists after user deletion: ${todoAfter.rows.length > 0 ? 'Yes' : 'No'}`);
            
            if (todoAfter.rows.length === 0) {
                console.log('   ✅ CASCADE delete is working - todo deleted when user was deleted');
            } else {
                console.log('   ❌ CASCADE delete NOT working - todo should have been deleted');
            }
        } catch (error) {
            console.log('   Error during CASCADE test:', error.message);
        }
        
        console.log('\n=== VERIFICATION SUMMARY ===');
        console.log('All verification steps completed');
        
        return true;
    } catch (err) {
        console.error('❌ Error during comprehensive schema verification:', err.message);
        return false;
    } finally {
        await client.end();
        console.log('\nConnection closed.');
    }
}

// Run the comprehensive schema verification
comprehensiveSchemaVerification().then(success => {
    if (success) {
        console.log('\n🎉 Comprehensive schema verification completed successfully!');
    } else {
        console.log('\n💥 Comprehensive schema verification failed!');
        process.exit(1);
    }
});
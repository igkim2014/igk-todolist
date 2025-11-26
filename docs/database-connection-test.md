# PostgreSQL Database Connection Test

This project includes a test script to verify the PostgreSQL database connection using the environment configuration.

## Environment Configuration

The database connection is configured in the `.env` file with the following variable:
- `POSTGRES_CONNECTION_STRING`: The connection string for the PostgreSQL database

## Test Script

The test script `test-db-connection.js`:
1. Loads the environment variables from `.env`
2. Creates a PostgreSQL client using the connection string
3. Attempts to connect to the database
4. Runs a simple query to verify the connection
5. Properly closes the connection

## Running the Test

To run the database connection test:
```bash
cd mockup
node test-db-connection.js
```

## Dependencies

The test script uses:
- `pg`: PostgreSQL client for Node.js
- `dotenv`: To load environment variables from `.env` file
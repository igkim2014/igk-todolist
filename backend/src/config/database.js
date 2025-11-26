const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Initialize Prisma Client with connection pool configuration
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully with Prisma');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

// Function to get connection pool statistics (simulating pg.Pool information)
const getConnectionStats = () => {
  // Prisma doesn't expose direct pool stats like pg.Pool, but we can return connection status
  return {
    status: 'connected', // This would be determined by an actual check
    // For a real pg.Pool implementation, we would return actual connection pool metrics
  };
};

module.exports = {
  prisma,
  testConnection,
  getConnectionStats,
};

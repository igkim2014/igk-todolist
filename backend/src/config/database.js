const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully with Prisma');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  prisma,
  testConnection,
};

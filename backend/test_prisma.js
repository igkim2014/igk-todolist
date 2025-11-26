const { prisma } = require('./src/config/database');

// Test script to verify Prisma setup
async function testPrismaConnection() {
  try {
    // Test connection to database
    await prisma.$connect();
    console.log('✅ Database connected successfully with Prisma');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ User count in database: ${userCount}`);

    // Test creating a test user (will be deleted)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'Test User'
      },
      select: {
        userId: true,
        email: true
      }
    });
    console.log(`✅ Test user created: ${testUser.email}`);

    // Clean up: delete the test user
    await prisma.user.delete({
      where: { userId: testUser.userId }
    });
    console.log('✅ Test user cleaned up');

    console.log('✅ All Prisma tests passed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPrismaConnection();
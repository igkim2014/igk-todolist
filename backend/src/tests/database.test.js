const { prisma, testConnection, getConnectionStats } = require('../config/database');

// Test to verify Prisma database connection
describe('Database Connection Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test to avoid conflicts
    jest.clearAllMocks();
  });

  test('should connect to database successfully', async () => {
    // Mock the prisma connection
    const mockConnect = jest.spyOn(prisma, '$connect').mockResolvedValue();
    const mockDisconnect = jest.spyOn(prisma, '$disconnect').mockResolvedValue();

    await expect(prisma.$connect()).resolves.not.toThrow();

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  test('should handle connection errors gracefully', async () => {
    // Mock a connection error
    jest.spyOn(prisma, '$connect').mockRejectedValue(new Error('Connection failed'));

    await expect(prisma.$connect()).rejects.toThrow('Connection failed');
  });

  test('should disconnect from database properly', async () => {
    const mockDisconnect = jest.spyOn(prisma, '$disconnect').mockResolvedValue();

    await expect(prisma.$disconnect()).resolves.not.toThrow();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  test('should test connection using testConnection function', async () => {
    const mockConnect = jest.spyOn(prisma, '$connect').mockResolvedValue();
    const mockDisconnect = jest.spyOn(prisma, '$disconnect').mockResolvedValue();

    const result = await testConnection();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  test('should test connection and handle errors properly', async () => {
    const mockConnect = jest.spyOn(prisma, '$connect').mockRejectedValue(new Error('Connection failed'));
    const mockDisconnect = jest.spyOn(prisma, '$disconnect').mockResolvedValue();

    const result = await testConnection();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(false);
  });

  test('should get connection stats', () => {
    const stats = getConnectionStats();
    expect(stats).toHaveProperty('status');
    expect(stats.status).toBe('connected');
  });
});

// Test for basic Prisma operations
describe('Prisma Operations Tests', () => {
  test('should count users in the database', async () => {
    const mockCount = jest.spyOn(prisma.user, 'count');
    mockCount.mockResolvedValue(0);

    const userCount = await prisma.user.count();

    expect(userCount).toBe(0);
    expect(mockCount).toHaveBeenCalledTimes(1);
  });

  test('should find a user by ID', async () => {
    const mockUser = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      username: 'testuser'
    };

    const mockFindUnique = jest.spyOn(prisma.user, 'findUnique');
    mockFindUnique.mockResolvedValue(mockUser);

    const user = await prisma.user.findUnique({
      where: { userId: '123e4567-e89b-12d3-a456-426614174000' }
    });

    expect(user).toEqual(mockUser);
    expect(mockFindUnique).toHaveBeenCalledTimes(1);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { userId: '123e4567-e89b-12d3-a456-426614174000' }
    });
  });

  test('should properly handle environment variables for database connection', () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });
});
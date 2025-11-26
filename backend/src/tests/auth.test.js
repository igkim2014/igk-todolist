const request = require('supertest');
const app = require('../app');
const { prisma } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../utils/jwtHelper');

jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  },
  testConnection: jest.fn()
}));
jest.mock('bcryptjs');
jest.mock('../utils/jwtHelper');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null); // Check email doesn't exist
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({
        userId: '1', email: 'test@example.com', username: 'test', role: 'user'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'test',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should return 409 if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'test',
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return tokens', async () => {
      prisma.user.findUnique.mockResolvedValue({
        userId: '1', email: 'test@example.com', password: 'hashedPassword', role: 'user'
      });
      bcrypt.compare.mockResolvedValue(true);
      jwtHelper.generateAccessToken.mockReturnValue('access-token');
      jwtHelper.generateRefreshToken.mockReturnValue('refresh-token');

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBe('access-token');
    });

    it('should return 401 for invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        userId: '1', email: 'test@example.com', password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      jwtHelper.verifyToken.mockReturnValue({ userId: '1', email: 'test@example.com', role: 'user' });
      prisma.user.findUnique.mockResolvedValue({ userId: '1' });
      jwtHelper.generateAccessToken.mockReturnValue('new-token');

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'valid-refresh-token' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.accessToken).toBe('new-token');
    });

    it('should return 401 if refresh token is invalid', async () => {
      jwtHelper.verifyToken.mockImplementation(() => { throw new Error('Invalid token'); });

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      jwtHelper.verifyToken.mockReturnValue({ userId: '1', role: 'user' });

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(res.statusCode).toBe(200);
    });
  });
});

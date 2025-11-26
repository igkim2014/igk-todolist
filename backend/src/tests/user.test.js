const request = require('supertest');
const app = require('../app');
const { prisma } = require('../config/database');
const jwtHelper = require('../utils/jwtHelper');
const bcrypt = require('bcryptjs');

jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    }
  },
  testConnection: jest.fn()
}));
jest.mock('../utils/jwtHelper');
jest.mock('bcryptjs');

describe('User API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwtHelper.verifyToken.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/users/me', () => {
    it('should return user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        userId: '1', username: 'test', email: 'test@example.com', role: 'user'
      });

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.username).toBe('test');
    });
  });

  describe('PATCH /api/users/me', () => {
    it('should update user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        userId: '1', username: 'test', email: 'test@example.com', role: 'user'
      });

      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      prisma.user.update.mockResolvedValue({
        userId: '1', username: 'updated', email: 'test@example.com', role: 'user'
      });

      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'updated' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.username).toBe('updated');
    });
  });
});

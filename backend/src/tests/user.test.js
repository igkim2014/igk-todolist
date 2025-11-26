const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');
jest.mock('jsonwebtoken');

describe('User API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwt.verify.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/users/me', () => {
    it('should return user profile', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ userId: '1', username: 'test' }],
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
      db.query.mockResolvedValueOnce({
        rows: [{ userId: '1', username: 'updated' }],
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

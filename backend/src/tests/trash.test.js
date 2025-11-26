const request = require('supertest');
const app = require('../app');
const { prisma } = require('../config/database');
const jwtHelper = require('../utils/jwtHelper');

jest.mock('../config/database', () => ({
  prisma: {
    todo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    }
  },
  testConnection: jest.fn()
}));
jest.mock('../utils/jwtHelper');

describe('Trash API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwtHelper.verifyToken.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/trash', () => {
    it('should return list of deleted todos', async () => {
      prisma.todo.findMany.mockResolvedValue([
        { todoId: '1', title: 'Deleted Todo', status: 'deleted', userId: '1' }
      ]);

      const res = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('DELETE /api/trash/:id', () => {
    it('should permanently delete a todo', async () => {
      prisma.todo.findUnique.mockResolvedValue({
        todoId: '1',
        userId: '1',
        status: 'deleted'
      });

      prisma.todo.delete.mockResolvedValue({
        todoId: '1'
      });

      const res = await request(app)
        .delete('/api/trash/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it('should fail if todo not found or not deleted', async () => {
      prisma.todo.findUnique.mockResolvedValue({
        todoId: '1',
        userId: '1',
        status: 'active'
      }); // check status

      const res = await request(app)
        .delete('/api/trash/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });
  });
});

const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');
jest.mock('jsonwebtoken');

describe('Trash API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwt.verify.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/trash', () => {
    it('should return list of deleted todos', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', title: 'Deleted Todo', status: 'deleted' }],
      });

      const res = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('DELETE /api/trash/:id', () => {
    it('should permanently delete a todo', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1' }],
      });

      const res = await request(app)
        .delete('/api/trash/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });
    
    it('should fail if todo not found or not deleted', async () => {
         db.query.mockResolvedValueOnce({ rows: [] }); // delete fails
         db.query.mockResolvedValueOnce({ rows: [{ status: 'active' }] }); // check status

         const res = await request(app)
            .delete('/api/trash/1')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(400);
    });
  });
});

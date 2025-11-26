const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');
jest.mock('jsonwebtoken');

describe('Todo API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwt.verify.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/todos', () => {
    it('should return list of todos', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', title: 'Test Todo', status: 'active' }],
      });

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', title: 'New Todo', status: 'active' }],
      });

      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Todo',
          startDate: '2025-01-01',
          dueDate: '2025-01-02'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe('New Todo');
    });

    it('should fail if validation fails', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });
  
  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
       db.query.mockResolvedValueOnce({ rows: [{ todoId: '1', userId: '1' }] }); // check exists
       db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', title: 'Updated Todo' }],
      });

      const res = await request(app)
        .put('/api/todos/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Todo' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated Todo');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should soft delete a todo', async () => {
       db.query.mockResolvedValueOnce({ rows: [{ todoId: '1', userId: '1' }] }); // check exists
       db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', status: 'deleted' }],
      });

      const res = await request(app)
        .delete('/api/todos/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('deleted');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    it('should complete a todo', async () => {
       db.query.mockResolvedValueOnce({ rows: [{ todoId: '1', userId: '1' }] }); // check exists
       db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', status: 'completed', isCompleted: true }],
      });

      const res = await request(app)
        .patch('/api/todos/1/complete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });
  });

  describe('PATCH /api/todos/:id/restore', () => {
    it('should restore a todo', async () => {
       db.query.mockResolvedValueOnce({ rows: [{ todoId: '1', userId: '1' }] }); // check exists
       db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', status: 'active' }],
      });

      const res = await request(app)
        .patch('/api/todos/1/restore')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('active');
    });
  });

  describe('GET /api/todos with filters', () => {
    it('should filter by status and search', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ todoId: '1', title: 'Search Match' }],
      });

      const res = await request(app)
        .get('/api/todos?status=active&search=Match')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');
jest.mock('jsonwebtoken');

describe('Holiday API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwt.verify.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/holidays', () => {
    it('should return list of holidays', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ holidayId: '1', title: 'Holiday 1' }],
      });

      const res = await request(app)
        .get('/api/holidays')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/holidays', () => {
    it('should create a holiday if admin', async () => {
      jwt.verify.mockReturnValue({ userId: '1', role: 'admin' });
      db.query.mockResolvedValueOnce({
        rows: [{ holidayId: '1', title: 'New Holiday' }],
      });

      const res = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Holiday', date: '2025-01-01' });

      expect(res.statusCode).toBe(201);
    });

    it('should fail if not admin', async () => {
      jwt.verify.mockReturnValue({ userId: '1', role: 'user' });

      const res = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Holiday', date: '2025-01-01' });

      expect(res.statusCode).toBe(403);
    });
  });
  
  describe('PUT /api/holidays/:id', () => {
      it('should update a holiday', async () => {
          jwt.verify.mockReturnValue({ userId: '1', role: 'admin' });
          db.query.mockResolvedValueOnce({
              rows: [{ holidayId: '1', title: 'Updated Holiday' }]
          });
          
          const res = await request(app)
            .put('/api/holidays/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Holiday' });
            
          expect(res.statusCode).toBe(200);
      });
  });
});

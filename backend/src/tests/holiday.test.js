const request = require('supertest');
const app = require('../app');
const { prisma } = require('../config/database');
const jwtHelper = require('../utils/jwtHelper');

jest.mock('../config/database', () => ({
  prisma: {
    holiday: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    }
  },
  testConnection: jest.fn()
}));
jest.mock('../utils/jwtHelper');

describe('Holiday API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = 'valid-token';
    jwtHelper.verifyAccessToken.mockReturnValue({ userId: '1', role: 'user' });
  });

  describe('GET /api/holidays', () => {
    it('should return list of holidays', async () => {
      prisma.holiday.findMany.mockResolvedValue([
        { holidayId: '1', title: 'Holiday 1', date: new Date('2025-01-01') }
      ]);

      const res = await request(app)
        .get('/api/holidays')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/holidays', () => {
    it('should create a holiday if admin', async () => {
      jwtHelper.verifyAccessToken.mockReturnValue({ userId: '1', role: 'admin' });
      prisma.holiday.create.mockResolvedValue({
        holidayId: '1', title: 'New Holiday', date: new Date('2025-01-01')
      });

      const res = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Holiday', date: '2025-01-01' });

      expect(res.statusCode).toBe(201);
    });

    it('should fail if not admin', async () => {
      jwtHelper.verifyAccessToken.mockReturnValue({ userId: '1', role: 'user' });

      const res = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Holiday', date: '2025-01-01' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/holidays/:id', () => {
      it('should update a holiday', async () => {
          jwtHelper.verifyAccessToken.mockReturnValue({ userId: '1', role: 'admin' });
          prisma.holiday.update.mockResolvedValue({
              holidayId: '1', title: 'Updated Holiday', date: new Date('2025-01-02')
          });

          const res = await request(app)
            .put('/api/holidays/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Updated Holiday', date: '2025-01-02' });

          expect(res.statusCode).toBe(200);
      });
  });
});

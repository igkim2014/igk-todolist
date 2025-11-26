const { authenticate, requireAdmin } = require('../middlewares/authMiddleware');
const { verifyAccessToken } = require('../utils/jwtHelper');

// Mock the jwtHelper to control the return values during testing
jest.mock('../utils/jwtHelper', () => ({
  verifyAccessToken: jest.fn(),
}));

// Mock response object
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('Authentication Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    test('should call next with user data when token is valid', () => {
      const mockUser = { userId: '123', role: 'user' };
      verifyAccessToken.mockReturnValue(mockUser);
      
      const req = {
        headers: {
          authorization: 'Bearer valid-token'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 401 when no authorization header is provided', () => {
      const req = {
        headers: {}
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      });
    });

    test('should return 401 when authorization header does not start with Bearer', () => {
      const req = {
        headers: {
          authorization: 'Invalid token'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다',
        },
      });
    });

    test('should return 401 when token has expired', () => {
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Access Token expired');
      });

      const req = {
        headers: {
          authorization: 'Bearer expired-token'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).toHaveBeenCalledWith('expired-token');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: '토큰이 만료되었습니다',
        },
      });
    });

    test('should return 401 when token is invalid', () => {
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid Access Token');
      });

      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다',
        },
      });
    });

    test('should return 401 for other token verification errors', () => {
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Some other error');
      });

      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      authenticate(req, res, next);

      expect(verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다',
        },
      });
    });
  });

  describe('requireAdmin middleware', () => {
    test('should call next when user is admin', () => {
      const req = {
        user: {
          userId: '123',
          role: 'admin'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 403 when no user is attached to request', () => {
      const req = {
        user: null
      };
      const res = createMockResponse();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ADMIN_REQUIRED',
          message: '관리자 권한이 필요합니다',
        },
      });
    });

    test('should return 403 when user role is not admin', () => {
      const req = {
        user: {
          userId: '123',
          role: 'user'
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ADMIN_REQUIRED',
          message: '관리자 권한이 필요합니다',
        },
      });
    });

    test('should return 403 when user role is undefined', () => {
      const req = {
        user: {
          userId: '123'
          // role is undefined
        }
      };
      const res = createMockResponse();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ADMIN_REQUIRED',
          message: '관리자 권한이 필요합니다',
        },
      });
    });
  });
});
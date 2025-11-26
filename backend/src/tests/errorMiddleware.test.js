const errorHandler = require('../middlewares/errorMiddleware');

// Mock response object
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('Error Handling Middleware Tests', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('should return standardized error response with default values', () => {
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Test error',
      },
      timestamp: expect.any(String),
      path: '/test-path',
    });
  });

  test('should return error response with custom status code and code', () => {
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const customError = new Error('Custom error');
    customError.statusCode = 404;
    customError.code = 'NOT_FOUND';

    errorHandler(customError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Custom error',
      },
      timestamp: expect.any(String),
      path: '/test-path',
    });
  });

  test('should include stack trace in development environment', () => {
    process.env.NODE_ENV = 'development';
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('Development error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Development error',
        stack: expect.stringContaining('Error: Development error'),
      },
    });
  });

  test('should not include stack trace in production environment', () => {
    process.env.NODE_ENV = 'production';
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('Production error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Production error',
      },
      timestamp: expect.any(String),
      path: '/test-path',
    });
  });

  test('should use default message if no error message', () => {
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error();
    // Remove message property for this test
    delete error.message;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다',
      },
      timestamp: expect.any(String),
      path: '/test-path',
    });
  });

  test('should log error to console', () => {
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('Test error');
    const originalConsoleError = console.error;
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;

    errorHandler(error, req, res, next);

    expect(mockConsoleError).toHaveBeenCalledWith(error.stack);

    // Restore original console.error
    console.error = originalConsoleError;
  });

  test('should handle errors without statusCode', () => {
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('No status error');
    // Remove statusCode property for this test
    delete error.statusCode;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500); // Default to 500
  });

  test('should handle errors without code property', () => {
    process.env.NODE_ENV = 'production';
    const req = { path: '/test-path' };
    const res = createMockResponse();
    const next = jest.fn();
    const error = new Error('No code error');
    // Remove code property for this test
    delete error.code;

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR', // Default code
        message: 'No code error',
      },
      timestamp: expect.any(String),
      path: '/test-path',
    });
  });
});
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace in development mode
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다';
  const code = err.code || 'INTERNAL_ERROR';

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  // In production, don't expose stack traces in the response
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack; // Include stack trace in development for debugging
  } else {
    // Add more generic information for production
    errorResponse.timestamp = new Date().toISOString();
    errorResponse.path = req.path; // Include request path for debugging
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

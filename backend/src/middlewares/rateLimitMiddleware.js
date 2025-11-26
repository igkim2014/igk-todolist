const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login/register requests per windowMs
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '인증 요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
    },
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};

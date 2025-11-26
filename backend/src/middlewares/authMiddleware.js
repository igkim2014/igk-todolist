const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../utils/jwtHelper');
const prisma = require('../config/database');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      if (!decoded) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }

      req.user = await prisma.user.findUnique({
        where: { userId: decoded.userId },
        select: {
          userId: true,
          username: true,
          email: true,
          role: true,
        },
      });

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };

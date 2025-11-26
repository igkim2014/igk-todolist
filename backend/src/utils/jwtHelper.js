const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || '15m';
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';
const SECRET = process.env.JWT_SECRET || 'test-jwt-secret'; // Use default for testing

if (!SECRET || SECRET === 'test-jwt-secret') {
  console.warn('JWT_SECRET is not defined in environment variables. Using default test secret.');
}

const generateAccessToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRATION });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRATION });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Access Token expired');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid Access Token');
    } else {
      throw err;
    }
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Refresh Token expired');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid Refresh Token');
    } else {
      throw err;
    }
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

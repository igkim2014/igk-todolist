const db = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordHelper');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwtHelper');

const register = async (email, password, username) => {
  const existingUser = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    const error = new Error('이미 사용 중인 이메일입니다');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const result = await db.query(
    'INSERT INTO "User" (email, password, username) VALUES ($1, $2, $3) RETURNING userId, email, username, role',
    [email, hashedPassword, username]
  );

  return result.rows[0];
};

const login = async (email, password) => {
  const userResult = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
  const user = userResult.rows[0];

  if (!user) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const payload = { userId: user.userId, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken);
    // Optional: Check if user still exists or if token is blacklisted
    const userResult = await db.query('SELECT * FROM "User" WHERE userId = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);

    return { accessToken: newAccessToken };
  } catch (err) {
    const error = new Error('유효하지 않은 Refresh Token입니다');
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN';
    throw error;
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};

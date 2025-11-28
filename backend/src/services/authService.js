/**
 * Auth Service
 * Clean Architecture - Use Case Layer
 * SOLID Principles: Dependency Inversion (의존성 역전)
 */

const userRepository = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/passwordHelper');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtHelper');

const register = async (email, password, username) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    const error = new Error('이미 사용 중인 이메일입니다');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepository.createUser({
    email,
    password: hashedPassword,
    username
  });

  // 비밀번호 제외한 사용자 정보 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email, password) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);

  if (!user) {
    const error = new Error('이메일 또는 비밀번호가 올바르지 않습니다');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  // Verify password
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
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists
    const user = await userRepository.findByUserId(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);

    return { accessToken: newAccessToken };
  } catch (err) {
    if (err.message === 'Refresh Token expired') {
      const error = new Error('Refresh Token expired');
      error.statusCode = 401;
      error.code = 'TOKEN_EXPIRED';
      throw error;
    } else if (err.message === 'Invalid Refresh Token') {
      const error = new Error('Invalid Refresh Token');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
    } else {
      const error = new Error('유효하지 않은 Refresh Token입니다');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
    }
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};

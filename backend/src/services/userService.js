/**
 * User Service
 * Clean Architecture - Use Case Layer
 * SOLID Principles: Dependency Inversion (의존성 역전)
 */

const userRepository = require('../repositories/UserRepository');
const { hashPassword } = require('../utils/passwordHelper');

const getProfile = async (userId) => {
  const user = await userRepository.getProfile(userId);

  if (!user) {
    const error = new Error('사용자를 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  const { username, password } = updateData;

  let updateFields = {};

  if (username) {
    updateFields.username = username;
  }

  if (password) {
    const hashedPassword = await hashPassword(password);
    updateFields.password = hashedPassword;
  }

  const updatedUser = await userRepository.updateUser(userId, updateFields);

  // 비밀번호 제외한 정보만 반환
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

module.exports = {
  getProfile,
  updateProfile,
};

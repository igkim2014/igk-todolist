const { prisma } = require('../config/database');
const { hashPassword } = require('../utils/passwordHelper');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      userId: userId
    },
    select: {
      userId: true,
      email: true,
      username: true,
      role: true,
      createdAt: true
    }
  });

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

  let updateFields = {
    updatedAt: new Date()
  };

  if (username) {
    updateFields.username = username;
  }

  if (password) {
    const hashedPassword = await hashPassword(password);
    updateFields.password = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    where: {
      userId: userId
    },
    data: updateFields,
    select: {
      userId: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return updatedUser;
};

module.exports = {
  getProfile,
  updateProfile,
};

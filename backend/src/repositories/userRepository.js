const prisma = require('../config/database');

class UserRepository {
  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId) {
    return await prisma.user.findUnique({
      where: { userId },
    });
  }
}

module.exports = new UserRepository();

const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtHelper');

class AuthService {
  async register(username, email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);

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
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async refresh(refreshToken) {
    // In a real app, we should verify the refresh token against the DB or Redis
    // Here we just verify the signature for MVP
    const { verifyToken } = require('../utils/jwtHelper');
    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = generateAccessToken(user.userId);
    return { accessToken };
  }
}

module.exports = new AuthService();

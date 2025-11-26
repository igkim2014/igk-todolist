const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  try {
    const user = await authService.register(username, email, password);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      res.status(409);
    } else {
      res.status(400);
    }
    throw error;
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  try {
    const data = await authService.login(email, password);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(401);
    throw error;
  }
});

const refreshUserToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  try {
    const data = await authService.refresh(refreshToken);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(401);
    throw error;
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  getMe,
};

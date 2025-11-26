const userService = require('../services/userService');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await userService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    const profile = await userService.updateProfile(userId, updateData);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

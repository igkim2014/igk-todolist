const holidayService = require('../services/holidayService');

const getHolidays = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const holidays = await holidayService.getHolidays(year, month);
    res.status(200).json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    next(error);
  }
};

const createHoliday = async (req, res, next) => {
  try {
    // req.user.role is checked by requireAdmin middleware
    const holidayData = req.body;
    const holiday = await holidayService.createHoliday(holidayData);
    res.status(201).json({
      success: true,
      data: holiday,
    });
  } catch (error) {
    next(error);
  }
};

const updateHoliday = async (req, res, next) => {
  try {
    const holidayId = req.params.id;
    const updateData = req.body;
    const holiday = await holidayService.updateHoliday(holidayId, updateData);
    res.status(200).json({
      success: true,
      data: holiday,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday,
};

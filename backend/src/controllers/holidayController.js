const asyncHandler = require('express-async-handler');
const holidayService = require('../services/holidayService');
const { admin } = require('../middlewares/authMiddleware'); // Admin middleware

const createHoliday = asyncHandler(async (req, res) => {
  const { title, date, description, isRecurring } = req.body;

  if (!title || !date) {
    res.status(400);
    throw new Error('Title and Date are required');
  }

  try {
    const holiday = await holidayService.createHoliday({ title, date, description, isRecurring });
    res.status(201).json({ success: true, data: holiday });
  } catch (error) {
    throw error;
  }
});

const getHolidays = asyncHandler(async (req, res) => {
  const filters = {
    year: req.query.year,
    month: req.query.month,
  };
  const holidays = await holidayService.getHolidays(filters);
  res.status(200).json({ success: true, data: holidays });
});

const updateHoliday = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, description, isRecurring } = req.body;

  try {
    const updatedHoliday = await holidayService.updateHoliday(id, { title, date, description, isRecurring });
    res.status(200).json({ success: true, data: updatedHoliday });
  } catch (error) {
    res.status(404);
    throw error;
  }
});

module.exports = {
  createHoliday,
  getHolidays,
  updateHoliday,
};

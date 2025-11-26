const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  createHoliday,
  getHolidays,
  updateHoliday,
} = require('../controllers/holidayController');

// Public route for all users (authenticated)
router.get('/', protect, getHolidays);

// Admin-only routes
router.post('/', protect, admin, createHoliday);
router.put('/:id', protect, admin, updateHoliday);

module.exports = router;

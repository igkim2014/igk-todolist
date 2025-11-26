const express = require('express');
const holidayController = require('../controllers/holidayController');
const { authenticate, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, holidayController.getHolidays);

router.post(
  '/',
  authenticate,
  requireAdmin,
  holidayController.createHoliday
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  holidayController.updateHoliday
);

module.exports = router;

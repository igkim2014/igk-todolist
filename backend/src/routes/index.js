const express = require('express');
const authRoutes = require('./authRoutes');
const todoRoutes = require('./todoRoutes');
const holidayRoutes = require('./holidayRoutes');
const trashRoutes = require('./trashRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/holidays', holidayRoutes);
router.use('/trash', trashRoutes);
router.use('/users', userRoutes);

module.exports = router;

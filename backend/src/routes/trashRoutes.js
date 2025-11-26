const express = require('express');
const trashController = require('../controllers/trashController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', trashController.getTrash);

router.delete('/:id', trashController.permanentlyDelete);

module.exports = router;

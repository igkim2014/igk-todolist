const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const todoController = require('../controllers/todoController');

// All trash routes require authentication
router.use(protect);

// Get all deleted todos (trash)
router.get('/', todoController.getTodos); // Re-use getTodos with status=DELETED

// Permanently delete a todo from trash
router.delete('/:id', todoController.permanentlyDeleteTodo);

module.exports = router;

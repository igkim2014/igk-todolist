const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  softDeleteTodo,
  restoreTodo,
  completeTodo,
  permanentlyDeleteTodo,
} = require('../controllers/todoController');

// All todo routes require authentication
router.use(protect);

router.route('/')
  .post(createTodo)
  .get(getTodos);

router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(softDeleteTodo); // Soft delete

router.patch('/:id/complete', completeTodo);
router.patch('/:id/restore', restoreTodo);
router.delete('/:id/permanent', permanentlyDeleteTodo); // Permanent delete

module.exports = router;

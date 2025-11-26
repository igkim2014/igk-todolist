const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const { authenticate } = require('../middlewares/authMiddleware');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', todoController.getTodos);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('제목은 필수 입력 항목입니다'),
    body('dueDate')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('유효한 날짜 형식이 아닙니다'),
  ],
  validate,
  todoController.createTodo
);

router.get('/:id', todoController.getTodoById);

router.put('/:id', todoController.updateTodo);

router.patch('/:id/complete', todoController.completeTodo);

router.delete('/:id', todoController.deleteTodo);

router.patch('/:id/restore', todoController.restoreTodo);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const { authenticate } = require('../middlewares/authMiddleware');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Todo 목록 조회
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todo 목록
 */
router.get('/', todoController.getTodos);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Todo 생성
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Todo 생성 성공
 */
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

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Todo 상세 조회
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID (UUID)
 *     responses:
 *       200:
 *         description: Todo 상세 정보
 */
router.get('/:id', todoController.getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Todo 수정
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID (UUID)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Todo 수정 성공
 */
router.put('/:id', todoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}/complete:
 *   patch:
 *     summary: Todo 완료 처리
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID (UUID)
 *     responses:
 *       200:
 *         description: Todo 완료 처리 성공
 */
router.patch('/:id/complete', todoController.completeTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Todo 삭제 (휴지통으로 이동)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID (UUID)
 *     responses:
 *       200:
 *         description: Todo 삭제 성공
 */
router.delete('/:id', todoController.deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/restore:
 *   patch:
 *     summary: Todo 복원
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Todo ID (UUID)
 *     responses:
 *       200:
 *         description: Todo 복원 성공
 */
router.patch('/:id/restore', todoController.restoreTodo);

module.exports = router;

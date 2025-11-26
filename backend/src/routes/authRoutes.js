const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const validate = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요'),
    body('password').isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다'),
    body('username').notEmpty().withMessage('사용자 이름을 입력해주세요'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ],
  validate,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

module.exports = router;

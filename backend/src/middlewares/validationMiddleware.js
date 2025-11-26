const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: errors.array()[0].msg,
        details: errors.array(),
      },
    });
  }
  next();
};

module.exports = validate;

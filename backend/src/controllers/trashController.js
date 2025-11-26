const trashService = require('../services/trashService');

const getTrash = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todos = await trashService.getTrash(userId);
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

const permanentlyDelete = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    await trashService.permanentlyDelete(todoId, userId);
    res.status(200).json({
      success: true,
      message: '할일이 영구적으로 삭제되었습니다',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrash,
  permanentlyDelete,
};

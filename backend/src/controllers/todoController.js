const todoService = require('../services/todoService');

const getTodos = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const filters = req.query;
    const todos = await todoService.getTodos(userId, filters);
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    const todo = await todoService.getTodoById(todoId, userId);
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoData = req.body;
    const todo = await todoService.createTodo(userId, todoData);
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    const updateData = req.body;
    const todo = await todoService.updateTodo(todoId, userId, updateData);
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const completeTodo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    const todo = await todoService.completeTodo(todoId, userId);
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    const result = await todoService.deleteTodo(todoId, userId);
    res.status(200).json({
      success: true,
      message: '할일이 휴지통으로 이동되었습니다',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const restoreTodo = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.id;
    const result = await todoService.restoreTodo(todoId, userId);
    res.status(200).json({
      success: true,
      message: '할일이 복원되었습니다',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  restoreTodo,
};

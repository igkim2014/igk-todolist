const asyncHandler = require('express-async-handler');
const todoService = require('../services/todoService');

const createTodo = asyncHandler(async (req, res) => {
  const { title, content, startDate, dueDate } = req.body;
  const userId = req.user.userId;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  try {
    const todo = await todoService.createTodo(userId, { title, content, startDate, dueDate });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    if (error.message === 'Due date cannot be before start date') {
      res.status(400);
    }
    throw error;
  }
});

const getTodos = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const filters = {
    status: req.query.status,
    search: req.query.search,
    sortBy: req.query.sortBy,
    order: req.query.order,
  };
  const todos = await todoService.getTodos(userId, filters);
  res.status(200).json({ success: true, data: todos });
});

const getTodoById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const todo = await todoService.getTodoById(id, userId);
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    res.status(404);
    throw error;
  }
});

const updateTodo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { title, content, startDate, dueDate, status, isCompleted } = req.body;

  try {
    const updatedTodo = await todoService.updateTodo(id, userId, {
      title,
      content,
      startDate,
      dueDate,
      status,
      isCompleted,
    });
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    if (error.message === 'Todo not found') {
      res.status(404);
    } else if (error.message === 'Due date cannot be before start date') {
      res.status(400);
    }
    throw error;
  }
});

const softDeleteTodo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const deletedTodo = await todoService.softDeleteTodo(id, userId);
    res.status(200).json({ success: true, message: 'Todo moved to trash', data: deletedTodo });
  } catch (error) {
    res.status(404);
    throw error;
  }
});

const restoreTodo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const restoredTodo = await todoService.restoreTodo(id, userId);
    res.status(200).json({ success: true, message: 'Todo restored', data: restoredTodo });
  } catch (error) {
    res.status(404);
    throw error;
  }
});

const completeTodo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    const completedTodo = await todoService.completeTodo(id, userId);
    res.status(200).json({ success: true, message: 'Todo completed', data: completedTodo });
  } catch (error) {
    res.status(404);
    throw error;
  }
});

const permanentlyDeleteTodo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  try {
    await todoService.permanentlyDeleteTodo(id, userId);
    res.status(200).json({ success: true, message: 'Todo permanently deleted' });
  } catch (error) {
    res.status(404);
    throw error;
  }
});


module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  softDeleteTodo,
  restoreTodo,
  completeTodo,
  permanentlyDeleteTodo,
};

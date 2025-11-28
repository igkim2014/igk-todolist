/**
 * Todo Service
 * Clean Architecture - Use Case Layer
 * SOLID Principles: Dependency Inversion (의존성 역전)
 */

const todoRepository = require('../repositories/TodoRepository');

const getTodos = async (userId, filters = {}) => {
  return await todoRepository.findByUserId(userId, filters);
};

const getTodoById = async (todoId, userId) => {
  const todo = await todoRepository.findByTodoIdAndUserId(todoId, userId);

  if (!todo) {
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }
  return todo;
};

const createTodo = async (userId, todoData) => {
  const { title, content, startDate, dueDate } = todoData;

  // 날짜 유효성 검사
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
    error.statusCode = 400;
    error.code = 'INVALID_DATE_RANGE';
    throw error;
  }

  return await todoRepository.createTodo(userId, {
    title,
    content,
    startDate,
    dueDate
  });
};

const updateTodo = async (todoId, userId, updateData) => {
  const { title, content, startDate, dueDate } = updateData;

  // 할일 존재 및 소유권 확인
  await getTodoById(todoId, userId);

  // 날짜 유효성 검사
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
    error.statusCode = 400;
    error.code = 'INVALID_DATE_RANGE';
    throw error;
  }

  return await todoRepository.updateTodo(todoId, userId, {
    title,
    content,
    startDate,
    dueDate
  });
};

const completeTodo = async (todoId, userId) => {
  // 할일 존재 및 소유권 확인
  await getTodoById(todoId, userId);

  const updatedTodo = await todoRepository.completeTodo(todoId, userId);
  return updatedTodo;
};

const deleteTodo = async (todoId, userId) => {
  // 할일 존재 및 소유권 확인
  await getTodoById(todoId, userId);

  const updatedTodo = await todoRepository.softDeleteTodo(todoId, userId);
  return updatedTodo;
};

const restoreTodo = async (todoId, userId) => {
  const todo = await todoRepository.findByTodoIdAndUserId(todoId, userId);

  if (!todo) {
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

  const restoredTodo = await todoRepository.restoreTodo(todoId, userId);
  return restoredTodo;
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

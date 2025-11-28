/**
 * Trash Service
 * Clean Architecture - Use Case Layer
 * SOLID Principles: Dependency Inversion (의존성 역전)
 */

const todoRepository = require('../repositories/TodoRepository');

const getTrash = async (userId) => {
  return await todoRepository.findDeletedByUserId(userId);
};

const permanentlyDelete = async (todoId, userId) => {
  // 할일 존재 확인
  const todo = await todoRepository.findByTodoIdAndUserId(todoId, userId);

  if (!todo) {
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

  if (todo.status !== 'deleted') {
    const error = new Error('활성 상태의 할일은 영구 삭제할 수 없습니다');
    error.statusCode = 400;
    error.code = 'BAD_REQUEST';
    throw error;
  }

  // 영구 삭제
  await todoRepository.hardDeleteTodo(todoId, userId);

  return true;
};

module.exports = {
  getTrash,
  permanentlyDelete,
};

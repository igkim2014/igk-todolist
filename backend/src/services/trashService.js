const { prisma } = require('../config/database');

const getTrash = async (userId) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: userId,
      status: 'deleted'
    },
    orderBy: {
      deletedAt: 'desc'
    }
  });
  return todos;
};

const permanentlyDelete = async (todoId, userId) => {
  // Check if the todo exists and is in deleted status
  const todo = await prisma.todo.findUnique({
    where: {
      todoId: todoId,
      userId: userId
    }
  });

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

  // Permanently delete the todo
  await prisma.todo.delete({
    where: {
      todoId: todoId,
      userId: userId
    }
  });

  return true;
};

module.exports = {
  getTrash,
  permanentlyDelete,
};


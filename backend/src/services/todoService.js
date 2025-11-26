const { prisma } = require('../config/database');

const getTodos = async (userId, filters = {}) => {
  const whereClause = {
    userId: userId,
    status: {
      in: ['active', 'completed']
    }
  };

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.search) {
    whereClause.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  const sortBy = filters.sortBy || 'createdAt';
  const order = filters.order || 'desc';

  // Safe list for sorting
  const safeSortFields = ['dueDate', 'createdAt'];
  const safeOrder = ['asc', 'desc'];

  const finalSort = safeSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const finalOrder = safeOrder.includes(order) ? order : 'desc';

  orderBy[finalSort] = finalOrder;

  const todos = await prisma.todo.findMany({
    where: whereClause,
    orderBy: orderBy
  });
  return todos;
};

const getTodoById = async (todoId, userId) => {
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
  return todo;
};

const createTodo = async (userId, todoData) => {
  const { title, content, startDate, dueDate } = todoData;

  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
     const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
     error.statusCode = 400;
     error.code = 'INVALID_DATE_RANGE';
     throw error;
  }

  const todo = await prisma.todo.create({
    data: {
      userId,
      title,
      content,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null
    }
  });
  return todo;
};

const updateTodo = async (todoId, userId, updateData) => {
  const { title, content, startDate, dueDate } = updateData;

  // Check existence and ownership
  await getTodoById(todoId, userId);

  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
     const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
     error.statusCode = 400;
     error.code = 'INVALID_DATE_RANGE';
     throw error;
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      todoId: todoId,
      userId: userId
    },
    data: {
      title,
      content,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined
    }
  });
  return updatedTodo;
};

const completeTodo = async (todoId, userId) => {
  await getTodoById(todoId, userId);
  const updatedTodo = await prisma.todo.update({
    where: {
      todoId: todoId,
      userId: userId
    },
    data: {
      status: 'completed',
      isCompleted: true
    }
  });
  return updatedTodo;
};

const deleteTodo = async (todoId, userId) => {
  await getTodoById(todoId, userId);
  const updatedTodo = await prisma.todo.update({
    where: {
      todoId: todoId,
      userId: userId
    },
    data: {
      status: 'deleted',
      deletedAt: new Date()
    }
  });
  return updatedTodo;
};

const restoreTodo = async (todoId, userId) => {
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

  const restoredTodo = await prisma.todo.update({
    where: {
      todoId: todoId,
      userId: userId
    },
    data: {
      status: 'active',
      deletedAt: null
    }
  });
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

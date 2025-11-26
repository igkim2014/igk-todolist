const db = require('../config/database');

const getTodos = async (userId, filters = {}) => {
  let query = 'SELECT * FROM "Todo" WHERE userId = $1 AND status IN (\'active\', \'completed\')';
  const params = [userId];
  let paramIndex = 2;

  if (filters.status) {
    query += ` AND status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters.search) {
    query += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const sortBy = filters.sortBy || 'createdAt';
  const order = filters.order || 'desc';
  
  // Safe list for sorting
  const safeSortFields = ['dueDate', 'createdAt'];
  const safeOrder = ['asc', 'desc'];

  const finalSort = safeSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const finalOrder = safeOrder.includes(order) ? order : 'desc';

  query += ` ORDER BY "${finalSort}" ${finalOrder}`;

  const result = await db.query(query, params);
  return result.rows;
};

const getTodoById = async (todoId, userId) => {
  const result = await db.query('SELECT * FROM "Todo" WHERE todoId = $1 AND userId = $2', [todoId, userId]);
  if (result.rows.length === 0) {
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }
  return result.rows[0];
};

const createTodo = async (userId, todoData) => {
  const { title, content, startDate, dueDate } = todoData;
  
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
     const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
     error.statusCode = 400;
     error.code = 'INVALID_DATE_RANGE';
     throw error;
  }

  const result = await db.query(
    'INSERT INTO "Todo" (userId, title, content, startDate, dueDate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, title, content, startDate, dueDate]
  );
  return result.rows[0];
};

const updateTodo = async (todoId, userId, updateData) => {
  const { title, content, startDate, dueDate } = updateData;
  
  // Check existence and ownership
  const todo = await getTodoById(todoId, userId);

  let finalStartDate = startDate !== undefined ? startDate : todo.startDate;
  let finalDueDate = dueDate !== undefined ? dueDate : todo.dueDate;

   if (finalStartDate && finalDueDate && new Date(finalDueDate) < new Date(finalStartDate)) {
     const error = new Error('만료일은 시작일과 같거나 이후여야 합니다');
     error.statusCode = 400;
     error.code = 'INVALID_DATE_RANGE';
     throw error;
  }

  const result = await db.query(
    'UPDATE "Todo" SET title = COALESCE($1, title), content = COALESCE($2, content), startDate = COALESCE($3, startDate), dueDate = COALESCE($4, dueDate), updatedAt = NOW() WHERE todoId = $5 AND userId = $6 RETURNING *',
    [title, content, startDate, dueDate, todoId, userId]
  );
  return result.rows[0];
};

const completeTodo = async (todoId, userId) => {
  await getTodoById(todoId, userId);
  const result = await db.query(
    'UPDATE "Todo" SET status = \'completed\', isCompleted = true, updatedAt = NOW() WHERE todoId = $1 AND userId = $2 RETURNING *',
    [todoId, userId]
  );
  return result.rows[0];
};

const deleteTodo = async (todoId, userId) => {
  await getTodoById(todoId, userId);
  const result = await db.query(
    'UPDATE "Todo" SET status = \'deleted\', deletedAt = NOW(), updatedAt = NOW() WHERE todoId = $1 AND userId = $2 RETURNING *',
    [todoId, userId]
  );
  return result.rows[0];
};

const restoreTodo = async (todoId, userId) => {
  const result = await db.query('SELECT * FROM "Todo" WHERE todoId = $1 AND userId = $2', [todoId, userId]);
   if (result.rows.length === 0) {
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

  const restoreResult = await db.query(
    'UPDATE "Todo" SET status = \'active\', deletedAt = NULL, updatedAt = NOW() WHERE todoId = $1 AND userId = $2 RETURNING *',
    [todoId, userId]
  );
  return restoreResult.rows[0];
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

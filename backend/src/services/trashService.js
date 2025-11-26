const db = require('../config/database');

const getTrash = async (userId) => {
  const result = await db.query(
    'SELECT * FROM "Todo" WHERE userId = $1 AND status = \'deleted\' ORDER BY deletedAt DESC',
    [userId]
  );
  return result.rows;
};

const permanentlyDelete = async (todoId, userId) => {
  const result = await db.query(
    'DELETE FROM "Todo" WHERE todoId = $1 AND userId = $2 AND status = \'deleted\' RETURNING *',
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    const check = await db.query('SELECT status FROM "Todo" WHERE todoId = $1 AND userId = $2', [todoId, userId]);
    if (check.rows.length > 0 && check.rows[0].status !== 'deleted') {
        const error = new Error('활성 상태의 할일은 영구 삭제할 수 없습니다');
        error.statusCode = 400;
        error.code = 'BAD_REQUEST';
        throw error;
    }
    const error = new Error('할일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }
  
  return true;
};

module.exports = {
  getTrash,
  permanentlyDelete,
};


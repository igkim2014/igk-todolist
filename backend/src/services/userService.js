const db = require('../config/database');
const { hashPassword } = require('../utils/passwordHelper');

const getProfile = async (userId) => {
  const result = await db.query('SELECT userId, email, username, role, createdAt FROM "User" WHERE userId = $1', [userId]);
  if (result.rows.length === 0) {
    const error = new Error('사용자를 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return result.rows[0];
};

const updateProfile = async (userId, updateData) => {
  const { username, password } = updateData;
  
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  let query = 'UPDATE "User" SET updatedAt = NOW()';
  const params = [userId];
  let paramIndex = 2;

  if (username) {
    query += `, username = $${paramIndex}`;
    params.push(username);
    paramIndex++;
  }

  if (hashedPassword) {
    query += `, password = $${paramIndex}`;
    params.push(hashedPassword);
    paramIndex++;
  }

  query += ` WHERE userId = $1 RETURNING userId, email, username, role, createdAt, updatedAt`;

  const result = await db.query(query, params);
  return result.rows[0];
};

module.exports = {
  getProfile,
  updateProfile,
};

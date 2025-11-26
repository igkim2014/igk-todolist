const db = require('../config/database');

const getHolidays = async (year, month) => {
  let query = 'SELECT * FROM "Holiday"';
  const params = [];
  const conditions = [];

  if (year) {
    conditions.push(`EXTRACT(YEAR FROM date) = $${params.length + 1}`);
    params.push(year);
  }

  if (month) {
    conditions.push(`EXTRACT(MONTH FROM date) = $${params.length + 1}`);
    params.push(month);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY date ASC';

  const result = await db.query(query, params);
  return result.rows;
};

const createHoliday = async (holidayData) => {
  const { title, date, description, isRecurring } = holidayData;
  const result = await db.query(
    'INSERT INTO "Holiday" (title, date, description, isRecurring) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, date, description, isRecurring !== undefined ? isRecurring : true]
  );
  return result.rows[0];
};

const updateHoliday = async (holidayId, updateData) => {
  const { title, date, description, isRecurring } = updateData;
  const result = await db.query(
    'UPDATE "Holiday" SET title = COALESCE($1, title), date = COALESCE($2, date), description = COALESCE($3, description), isRecurring = COALESCE($4, isRecurring), updatedAt = NOW() WHERE holidayId = $5 RETURNING *',
    [title, date, description, isRecurring, holidayId]
  );
  
  if (result.rows.length === 0) {
    const error = new Error('국경일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return result.rows[0];
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday,
};

/**
 * Base Repository
 * Clean Architecture - Interface Adapter Layer
 * SOLID Principles: Single Responsibility, Open/Closed
 */

const { pool } = require('../../database/pool');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * 단일 레코드 조회 (Primary Key 기준)
   */
  async findById(id, idColumn = 'id') {
    const query = `SELECT * FROM "${this.tableName}" WHERE "${idColumn}" = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 조건에 맞는 모든 레코드 조회
   */
  async findAll(whereClause = '', params = [], orderBy = 'createdAt DESC') {
    let query = `SELECT * FROM "${this.tableName}"`;

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  /**
   * 조건에 맞는 단일 레코드 조회
   */
  async findOne(whereClause, params = []) {
    const query = `SELECT * FROM "${this.tableName}" WHERE ${whereClause} LIMIT 1`;
    const result = await this.pool.query(query, params);
    return result.rows[0] || null;
  }

  /**
   * 레코드 생성
   */
  async create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO "${this.tableName}"
      ("${columns.join('", "')}")
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * 레코드 업데이트
   */
  async update(id, data, idColumn = 'id') {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const setClause = columns
      .map((col, index) => `"${col}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "${this.tableName}"
      SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "${idColumn}" = $${values.length + 1}
      RETURNING *
    `;

    const result = await this.pool.query(query, [...values, id]);
    return result.rows[0] || null;
  }

  /**
   * 레코드 삭제 (물리적 삭제)
   */
  async delete(id, idColumn = 'id') {
    const query = `DELETE FROM "${this.tableName}" WHERE "${idColumn}" = $1 RETURNING *`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * 레코드 개수 조회
   */
  async count(whereClause = '', params = []) {
    let query = `SELECT COUNT(*) as count FROM "${this.tableName}"`;

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    const result = await this.pool.query(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * 트랜잭션 시작
   */
  async beginTransaction() {
    const client = await this.pool.connect();
    await client.query('BEGIN');
    return client;
  }

  /**
   * 트랜잭션 커밋
   */
  async commitTransaction(client) {
    await client.query('COMMIT');
    client.release();
  }

  /**
   * 트랜잭션 롤백
   */
  async rollbackTransaction(client) {
    await client.query('ROLLBACK');
    client.release();
  }

  /**
   * 원시 쿼리 실행
   */
  async query(sql, params = []) {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }
}

module.exports = BaseRepository;

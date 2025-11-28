/**
 * Database Configuration
 * Clean Architecture - Infrastructure Layer
 *
 * pg 라이브러리를 사용한 PostgreSQL 연결
 */

const { pool, testConnection, close, getConnectionStats } = require('../database/pool');

module.exports = {
  pool,
  testConnection,
  close,
  getConnectionStats,
};

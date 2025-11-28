/**
 * PostgreSQL 연결 풀 관리
 * Clean Architecture - Infrastructure Layer
 */

const { Pool } = require('pg');
require('dotenv').config();

class DatabasePool {
  constructor() {
    if (!DatabasePool.instance) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase')
          ? { rejectUnauthorized: false }
          : false,
      });

      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
      });

      DatabasePool.instance = this;
    }

    return DatabasePool.instance;
  }

  getPool() {
    return this.pool;
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW()');
      console.log('Database connected successfully:', result.rows[0].now);
      client.release();
      return true;
    } catch (err) {
      console.error('Database connection failed:', err.message);
      return false;
    }
  }

  async close() {
    await this.pool.end();
  }

  getConnectionStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Singleton instance
const dbPool = new DatabasePool();

module.exports = {
  pool: dbPool.getPool(),
  testConnection: () => dbPool.testConnection(),
  close: () => dbPool.close(),
  getConnectionStats: () => dbPool.getConnectionStats(),
};

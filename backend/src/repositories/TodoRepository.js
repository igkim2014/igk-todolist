/**
 * Todo Repository
 * Clean Architecture - Interface Adapter Layer
 * SOLID Principles: Single Responsibility, Dependency Inversion
 */

const BaseRepository = require('./base/BaseRepository');
const { v4: uuidv4 } = require('uuid');

class TodoRepository extends BaseRepository {
  constructor() {
    super('Todo');
  }

  /**
   * todoId로 할일 조회
   */
  async findByTodoId(todoId) {
    return await this.findById(todoId, 'todoId');
  }

  /**
   * todoId와 userId로 할일 조회 (소유권 확인)
   */
  async findByTodoIdAndUserId(todoId, userId) {
    return await this.findOne('"todoId" = $1 AND "userId" = $2', [todoId, userId]);
  }

  /**
   * 사용자의 모든 할일 조회 (필터 포함)
   */
  async findByUserId(userId, filters = {}) {
    const conditions = ['"userId" = $1'];
    const params = [userId];
    let paramIndex = 2;

    // 기본적으로 active와 completed만 조회 (삭제된 항목 제외)
    if (!filters.includeDeleted) {
      conditions.push('"status" IN (\'active\', \'completed\')');
    }

    // status 필터
    if (filters.status) {
      conditions.push(`"status" = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    // 검색 필터 (title 또는 content)
    if (filters.search) {
      conditions.push(`("title" ILIKE $${paramIndex} OR "content" ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // 정렬
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'desc';
    const safeSortFields = ['dueDate', 'createdAt', 'updatedAt'];
    const safeOrder = ['asc', 'desc'];

    const finalSort = safeSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalOrder = safeOrder.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC';
    const orderBy = `"${finalSort}" ${finalOrder}`;

    return await this.findAll(whereClause, params, orderBy);
  }

  /**
   * 할일 생성
   */
  async createTodo(userId, todoData) {
    const { title, content, startDate, dueDate } = todoData;

    const newTodo = {
      todoId: uuidv4(),
      userId,
      title,
      content: content || null,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'active',
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    return await this.create(newTodo);
  }

  /**
   * 할일 업데이트
   */
  async updateTodo(todoId, userId, updateData) {
    const allowedFields = ['title', 'content', 'startDate', 'dueDate'];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        if (key === 'startDate' || key === 'dueDate') {
          filteredData[key] = updateData[key] ? new Date(updateData[key]) : null;
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return await this.findByTodoIdAndUserId(todoId, userId);
    }

    const columns = Object.keys(filteredData);
    const values = Object.values(filteredData);
    const setClause = columns
      .map((col, index) => `"${col}" = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE "${this.tableName}"
      SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "todoId" = $${values.length + 1} AND "userId" = $${values.length + 2}
      RETURNING *
    `;

    const result = await this.pool.query(query, [...values, todoId, userId]);
    return result.rows[0] || null;
  }

  /**
   * 할일 완료 처리
   */
  async completeTodo(todoId, userId) {
    const query = `
      UPDATE "${this.tableName}"
      SET "status" = 'completed', "isCompleted" = true, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [todoId, userId]);
    return result.rows[0] || null;
  }

  /**
   * 할일 삭제 (소프트 삭제)
   */
  async softDeleteTodo(todoId, userId) {
    const query = `
      UPDATE "${this.tableName}"
      SET "status" = 'deleted', "deletedAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [todoId, userId]);
    return result.rows[0] || null;
  }

  /**
   * 할일 복원
   */
  async restoreTodo(todoId, userId) {
    const query = `
      UPDATE "${this.tableName}"
      SET "status" = 'active', "deletedAt" = NULL, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [todoId, userId]);
    return result.rows[0] || null;
  }

  /**
   * 할일 영구 삭제
   */
  async hardDeleteTodo(todoId, userId) {
    const query = `
      DELETE FROM "${this.tableName}"
      WHERE "todoId" = $1 AND "userId" = $2
      RETURNING *
    `;
    const result = await this.pool.query(query, [todoId, userId]);
    return result.rows[0] || null;
  }

  /**
   * 휴지통 조회 (삭제된 할일)
   */
  async findDeletedByUserId(userId) {
    return await this.findAll(
      '"userId" = $1 AND "status" = \'deleted\'',
      [userId],
      '"deletedAt" DESC'
    );
  }

  /**
   * 만료 예정 할일 조회
   */
  async findUpcomingDueTodos(userId, days = 7) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE "userId" = $1
        AND "status" = 'active'
        AND "dueDate" IS NOT NULL
        AND "dueDate" <= CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY "dueDate" ASC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * 만료된 할일 조회
   */
  async findOverdueTodos(userId) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE "userId" = $1
        AND "status" = 'active'
        AND "dueDate" IS NOT NULL
        AND "dueDate" < CURRENT_DATE
      ORDER BY "dueDate" DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = new TodoRepository();

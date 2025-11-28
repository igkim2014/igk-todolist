/**
 * Holiday Repository
 * Clean Architecture - Interface Adapter Layer
 * SOLID Principles: Single Responsibility, Dependency Inversion
 */

const BaseRepository = require('./base/BaseRepository');
const { v4: uuidv4 } = require('uuid');

class HolidayRepository extends BaseRepository {
  constructor() {
    super('Holiday');
  }

  /**
   * holidayId로 국경일 조회
   */
  async findByHolidayId(holidayId) {
    return await this.findById(holidayId, 'holidayId');
  }

  /**
   * 모든 국경일 조회
   */
  async findAllHolidays(orderBy = '"date" ASC') {
    return await this.findAll('', [], orderBy);
  }

  /**
   * 특정 연도의 국경일 조회
   */
  async findByYear(year) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE EXTRACT(YEAR FROM "date") = $1
      ORDER BY "date" ASC
    `;
    const result = await this.pool.query(query, [year]);
    return result.rows;
  }

  /**
   * 특정 월의 국경일 조회
   */
  async findByMonth(year, month) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE EXTRACT(YEAR FROM "date") = $1
        AND EXTRACT(MONTH FROM "date") = $2
      ORDER BY "date" ASC
    `;
    const result = await this.pool.query(query, [year, month]);
    return result.rows;
  }

  /**
   * 날짜 범위로 국경일 조회
   */
  async findByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE "date" >= $1 AND "date" <= $2
      ORDER BY "date" ASC
    `;
    const result = await this.pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  /**
   * 국경일 생성
   */
  async createHoliday(holidayData) {
    const { title, date, description, isRecurring = true } = holidayData;

    const newHoliday = {
      holidayId: uuidv4(),
      title,
      date: new Date(date),
      description: description || null,
      isRecurring,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(newHoliday);
  }

  /**
   * 국경일 업데이트
   */
  async updateHoliday(holidayId, updateData) {
    const allowedFields = ['title', 'date', 'description', 'isRecurring'];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        if (key === 'date') {
          filteredData[key] = new Date(updateData[key]);
        } else {
          filteredData[key] = updateData[key];
        }
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return await this.findByHolidayId(holidayId);
    }

    return await this.update(holidayId, filteredData, 'holidayId');
  }

  /**
   * 국경일 삭제 (물리적 삭제)
   * 참고: 비즈니스 규칙상 국경일은 삭제 불가하지만 메서드는 제공
   */
  async deleteHoliday(holidayId) {
    return await this.delete(holidayId, 'holidayId');
  }

  /**
   * 반복 국경일만 조회
   */
  async findRecurringHolidays() {
    return await this.findAll('"isRecurring" = true', [], '"date" ASC');
  }

  /**
   * 제목으로 국경일 검색
   */
  async searchByTitle(searchTerm) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE "title" ILIKE $1
      ORDER BY "date" ASC
    `;
    const result = await this.pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * 오늘 이후의 국경일 조회
   */
  async findUpcomingHolidays(limit = 10) {
    const query = `
      SELECT * FROM "${this.tableName}"
      WHERE "date" >= CURRENT_DATE
      ORDER BY "date" ASC
      LIMIT $1
    `;
    const result = await this.pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = new HolidayRepository();

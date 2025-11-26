const prisma = require('../config/database');

class HolidayRepository {
  async createHoliday(data) {
    return await prisma.holiday.create({ data });
  }

  async findHolidayById(holidayId) {
    return await prisma.holiday.findUnique({
      where: { holidayId },
    });
  }

  async findHolidays(filters) {
    const { year, month } = filters;
    const where = {};

    if (year) {
      where.date = {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
      };
    }
    if (month) {
      if (!year) {
        // If month is provided without year, default to current year
        const currentYear = new Date().getFullYear();
        where.date = {
          gte: new Date(`${currentYear}-${month}-01T00:00:00.000Z`),
          lt: new Date(currentYear, parseInt(month), 1, 0, 0, 0, 0).toISOString(), // Next month's first day
        };
      } else {
        where.date = {
          gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
          lt: new Date(year, parseInt(month), 1, 0, 0, 0, 0).toISOString(),
        };
      }
    }

    return await prisma.holiday.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async updateHoliday(holidayId, data) {
    return await prisma.holiday.update({
      where: { holidayId },
      data,
    });
  }

  // Holidays cannot be deleted as per PRD
}

module.exports = new HolidayRepository();

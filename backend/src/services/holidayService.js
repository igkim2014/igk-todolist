const { prisma } = require('../config/database');

const getHolidays = async (year, month) => {
  const whereClause = {};

  if (year) {
    whereClause.date = {
      gte: new Date(year, 0, 1),  // January 1st of the year
      lt: new Date(year + 1, 0, 1)  // January 1st of the next year
    };
  }

  if (month && year) {
    // Refine the date range if both year and month are provided
    whereClause.date = {
      gte: new Date(year, month - 1, 1),  // First day of the month
      lt: new Date(year, month, 1)  // First day of the next month
    };
  }

  const holidays = await prisma.holiday.findMany({
    where: whereClause,
    orderBy: {
      date: 'asc'
    }
  });
  return holidays;
};

const createHoliday = async (holidayData) => {
  const { title, date, description, isRecurring } = holidayData;
  const holiday = await prisma.holiday.create({
    data: {
      title,
      date: new Date(date),
      description,
      isRecurring: isRecurring !== undefined ? isRecurring : true
    }
  });
  return holiday;
};

const updateHoliday = async (holidayId, updateData) => {
  const { title, date, description, isRecurring } = updateData;
  const holiday = await prisma.holiday.update({
    where: {
      holidayId: holidayId
    },
    data: {
      title: title !== undefined ? title : undefined,
      date: date !== undefined ? new Date(date) : undefined,
      description: description !== undefined ? description : undefined,
      isRecurring: isRecurring !== undefined ? isRecurring : undefined
    }
  });

  if (!holiday) {
    const error = new Error('국경일을 찾을 수 없습니다');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return holiday;
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday,
};

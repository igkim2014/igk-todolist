/**
 * Holiday Service
 * Clean Architecture - Use Case Layer
 * SOLID Principles: Dependency Inversion (의존성 역전)
 */

const holidayRepository = require('../repositories/HolidayRepository');

const getHolidays = async (year, month) => {
  if (year && month) {
    return await holidayRepository.findByMonth(year, month);
  } else if (year) {
    return await holidayRepository.findByYear(year);
  } else {
    return await holidayRepository.findAllHolidays();
  }
};

const createHoliday = async (holidayData) => {
  const { title, date, description, isRecurring } = holidayData;

  return await holidayRepository.createHoliday({
    title,
    date,
    description,
    isRecurring: isRecurring !== undefined ? isRecurring : true
  });
};

const updateHoliday = async (holidayId, updateData) => {
  const holiday = await holidayRepository.updateHoliday(holidayId, updateData);

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

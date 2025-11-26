const holidayRepository = require('../repositories/holidayRepository');

class HolidayService {
  async createHoliday(holidayData) {
    return await holidayRepository.createHoliday(holidayData);
  }

  async getHolidays(filters) {
    return await holidayRepository.findHolidays(filters);
  }

  async getHolidayById(holidayId) {
    const holiday = await holidayRepository.findHolidayById(holidayId);
    if (!holiday) {
      throw new Error('Holiday not found');
    }
    return holiday;
  }

  async updateHoliday(holidayId, holidayData) {
    await this.getHolidayById(holidayId); // Check existence
    return await holidayRepository.updateHoliday(holidayId, holidayData);
  }
}

module.exports = new HolidayService();

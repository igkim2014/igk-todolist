import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 국경일 관련 API 서비스
 */
const holidayService = {
  /**
   * 국경일 목록 조회
   * @param {number} year - 연도
   * @param {number} month - 월
   * @returns {Promise<Object>} 국경일 목록
   */
  getHolidays: async (year, month) => {
    const params = new URLSearchParams();
    
    if (year) params.append('year', year);
    if (month) params.append('month', month);

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.HOLIDAYS.BASE}?${queryString}` : API_ENDPOINTS.HOLIDAYS.BASE;
    
    const response = await api.get(endpoint);
    return response.data;
  },

  /**
   * 국경일 추가
   * @param {Object} holidayData - 국경일 데이터
   * @returns {Promise<Object>} 생성된 국경일
   */
  createHoliday: async (holidayData) => {
    const response = await api.post(API_ENDPOINTS.HOLIDAYS.BASE, holidayData);
    return response.data;
  },

  /**
   * 국경일 수정
   * @param {string} id - 국경일 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<Object>} 수정된 국경일
   */
  updateHoliday: async (id, updateData) => {
    const response = await api.put(API_ENDPOINTS.HOLIDAYS.BY_ID(id), updateData);
    return response.data;
  },

  /**
   * 국경일 삭제
   * @param {string} id - 국경일 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  deleteHoliday: async (id) => {
    const response = await api.delete(API_ENDPOINTS.HOLIDAYS.BY_ID(id));
    return response.data;
  },
};

export default holidayService;

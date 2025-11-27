import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 휴지통 관련 API 서비스
 */
const trashService = {
  /**
   * 휴지통 목록 조회
   * @returns {Promise<Object>} 삭제된 할일 목록
   */
  getTrash: async () => {
    const response = await api.get(API_ENDPOINTS.TRASH.BASE);
    return response.data;
  },

  /**
   * 영구 삭제
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  permanentlyDelete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TRASH.BY_ID(id));
    return response.data;
  },

  /**
   * 휴지통 비우기 (모든 삭제된 할일 영구 삭제)
   * @returns {Promise<Object>} 비우기 결과
   */
  emptyTrash: async () => {
    const response = await api.delete(API_ENDPOINTS.TRASH.BASE);
    return response.data;
  },
};

export default trashService;

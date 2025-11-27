import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 사용자 관련 API 서비스
 */
const userService = {
  /**
   * 사용자 프로필 조회
   * @returns {Promise<Object>} 사용자 프로필 정보
   */
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  /**
   * 사용자 프로필 수정
   * @param {Object} updateData - 수정할 프로필 데이터
   * @returns {Promise<Object>} 수정된 프로필 정보
   */
  updateProfile: async (updateData) => {
    const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, updateData);
    return response.data;
  },

  /**
   * 비밀번호 변경
   * @param {Object} passwordData - 현재 비밀번호와 새 비밀번호
   * @returns {Promise<Object>} 변경 결과
   */
  changePassword: async (passwordData) => {
    const response = await api.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData);
    return response.data;
  },
};

export default userService;

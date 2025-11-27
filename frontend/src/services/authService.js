import api from './api';

/**
 * 사용자 인증 관련 API 서비스
 */
const authService = {
  /**
   * 로그인
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} 로그인 결과 (tokens, user)
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * 회원가입
   * @param {string} email 
   * @param {string} password 
   * @param {string} username 
   * @returns {Promise<Object>} 회원가입 결과
   */
  register: async (email, password, username) => {
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  },

  /**
   * 토큰 갱신
   * @param {string} refreshToken 
   * @returns {Promise<Object>} 새로운 Access Token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * 로그아웃
   * @returns {Promise<void>}
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;

import { create } from 'zustand';
import authService from '../services/authService';
import { setAccessToken, setRefreshToken, clearTokens, getAccessToken } from '../utils/tokenManager';

/**
 * 인증 상태 관리 스토어
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * 로그인 액션
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, user } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '로그인 실패', 
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * 회원가입 액션
   * @param {string} email 
   * @param {string} password 
   * @param {string} username 
   */
  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(email, password, username);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error?.message || '회원가입 실패', 
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * 로그아웃 액션
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  /**
   * 초기화 (새로고침 시 토큰 확인 등)
   * 실제로는 /users/me 같은 API를 호출하여 유저 정보를 가져와야 하지만,
   * MVP에서는 간단히 토큰 유무로 체크하거나 API 호출을 추가할 수 있음.
   */
  checkAuth: async () => {
      const token = getAccessToken();
      if (token) {
          set({ isAuthenticated: true });
          // TODO: Fetch user profile logic here if needed
      } else {
          set({ isAuthenticated: false, user: null });
      }
  }
}));

export default useAuthStore;

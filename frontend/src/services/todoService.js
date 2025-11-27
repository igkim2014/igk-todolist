import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 할일 관련 API 서비스
 */
const todoService = {
  /**
   * 할일 목록 조회
   * @param {Object} filters - 필터 객체
   * @returns {Promise<Object>} 할일 목록
   */
  getTodos: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.TODOS.BASE}?${queryString}` : API_ENDPOINTS.TODOS.BASE;
    
    const response = await api.get(endpoint);
    return response.data;
  },

  /**
   * 할일 상세 조회
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 할일 상세 정보
   */
  getTodoById: async (id) => {
    const response = await api.get(API_ENDPOINTS.TODOS.BY_ID(id));
    return response.data;
  },

  /**
   * 할일 생성
   * @param {Object} todoData - 할일 데이터
   * @returns {Promise<Object>} 생성된 할일
   */
  createTodo: async (todoData) => {
    const response = await api.post(API_ENDPOINTS.TODOS.BASE, todoData);
    return response.data;
  },

  /**
   * 할일 수정
   * @param {string} id - 할일 ID
   * @param {Object} updateData - 수정할 데이터
   * @returns {Promise<Object>} 수정된 할일
   */
  updateTodo: async (id, updateData) => {
    const response = await api.put(API_ENDPOINTS.TODOS.BY_ID(id), updateData);
    return response.data;
  },

  /**
   * 할일 완료 처리
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 완료된 할일
   */
  completeTodo: async (id) => {
    const response = await api.patch(API_ENDPOINTS.TODOS.COMPLETE(id));
    return response.data;
  },

  /**
   * 할일 삭제 (휴지통으로 이동)
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 삭제된 할일
   */
  deleteTodo: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TODOS.BY_ID(id));
    return response.data;
  },

  /**
   * 할일 복원 (휴지통에서 복구)
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 복원된 할일
   */
  restoreTodo: async (id) => {
    const response = await api.patch(API_ENDPOINTS.TODOS.RESTORE(id));
    return response.data;
  },

  /**
   * 할일 영구 삭제
   * @param {string} id - 할일 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  permanentlyDeleteTodo: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TRASH.PERMANENTLY_DELETE(id));
    return response.data;
  },
};

export default todoService;

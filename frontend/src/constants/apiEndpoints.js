// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // 할일
  TODOS: {
    BASE: '/todos',
    BY_ID: (id) => `/todos/${id}`,
    COMPLETE: (id) => `/todos/${id}/complete`,
    RESTORE: (id) => `/todos/${id}/restore`,
  },

  // 휴지통
  TRASH: {
    BASE: '/trash',
    BY_ID: (id) => `/trash/${id}`,
    PERMANENTLY_DELETE: (id) => `/trash/${id}`,
  },

  // 국경일
  HOLIDAYS: {
    BASE: '/holidays',
    BY_ID: (id) => `/holidays/${id}`,
  },

  // 사용자
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/password',
  },
};

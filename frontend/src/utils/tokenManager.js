/**
 * LocalStorage에 토큰을 저장하고 관리하는 유틸리티
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Access Token 저장
 * @param {string} token - Access Token
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

/**
 * Refresh Token 저장
 * @param {string} token - Refresh Token
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Access Token 조회
 * @returns {string|null} Access Token
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Refresh Token 조회
 * @returns {string|null} Refresh Token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Access Token 삭제
 */
export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * Refresh Token 삭제
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * 모든 토큰 삭제 (로그아웃)
 */
export const clearTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * 토큰이 존재하는지 확인
 * @returns {boolean} 토큰이 존재하면 true
 */
export const hasToken = () => {
  return !!getAccessToken();
};

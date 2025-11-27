/**
 * 입력 검증 유틸리티 함수
 */

/**
 * 이메일 유효성 검증
 * @param {string} email - 이메일 주소
 * @returns {boolean} 유효하면 true
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검증 (최소 6자)
 * @param {string} password - 비밀번호
 * @returns {boolean} 유효하면 true
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

/**
 * 비밀번호 강도 검증 (8자 이상, 영문+숫자 포함)
 * @param {string} password - 비밀번호
 * @returns {boolean} 유효하면 true
 */
export const isStrongPassword = (password) => {
  if (!password) return false;
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasMinLength && hasLetter && hasNumber;
};

/**
 * 사용자 이름 유효성 검증 (2-20자)
 * @param {string} username - 사용자 이름
 * @returns {boolean} 유효하면 true
 */
export const isValidUsername = (username) => {
  if (!username) return false;
  return username.length >= 2 && username.length <= 20;
};

/**
 * 날짜 유효성 검증 (YYYY-MM-DD)
 * @param {string} dateString - 날짜 문자열
 * @returns {boolean} 유효하면 true
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * 날짜 범위 유효성 검증 (시작일 <= 종료일)
 * @param {string} startDate - 시작일
 * @param {string} endDate - 종료일
 * @returns {boolean} 유효하면 true
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * 빈 문자열 검증
 * @param {string} value - 검증할 값
 * @returns {boolean} 비어있지 않으면 true
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  return value.toString().trim().length > 0;
};

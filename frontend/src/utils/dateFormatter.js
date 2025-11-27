import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 포맷팅
 * @param {string|Date} date - 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy-MM-dd', { locale: ko });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '';
  }
};

/**
 * 날짜를 'YYYY년 MM월 DD일' 형식으로 포맷팅
 * @param {string|Date} date - 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDateKorean = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy년 MM월 dd일', { locale: ko });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '';
  }
};

/**
 * 날짜를 'MM/DD' 형식으로 포맷팅
 * @param {string|Date} date - 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDateShort = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'MM/dd', { locale: ko });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '';
  }
};

/**
 * 날짜와 시간을 'YYYY-MM-DD HH:mm' 형식으로 포맷팅
 * @param {string|Date} date - 날짜
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, 'yyyy-MM-dd HH:mm', { locale: ko });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '';
  }
};

/**
 * 날짜가 오늘인지 확인
 * @param {string|Date} date - 날짜
 * @returns {boolean} 오늘이면 true
 */
export const isToday = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    const today = new Date();
    return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  } catch (error) {
    return false;
  }
};

/**
 * 날짜가 과거인지 확인
 * @param {string|Date} date - 날짜
 * @returns {boolean} 과거이면 true
 */
export const isPast = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  } catch (error) {
    return false;
  }
};

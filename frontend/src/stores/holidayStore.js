import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import holidayService from '../services/holidayService';

/**
 * 국경일 상태 관리 스토어
 */
const useHolidayStore = create(
  devtools((set, get) => ({
    // 상태
    holidays: [],
    isLoading: false,
    error: null,

    // 액션
    /**
     * 국경일 목록 조회
     */
    fetchHolidays: async (year, month) => {
      set({ isLoading: true, error: null });
      try {
        const response = await holidayService.getHolidays(year, month);
        set({ holidays: response.data, isLoading: false });
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '국경일 목록을 불러오는데 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 국경일 추가 (관리자 전용)
     */
    createHoliday: async (holidayData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await holidayService.createHoliday(holidayData);
        const { holidays } = get();
        set({ 
          holidays: [response.data, ...holidays],
          isLoading: false 
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '국경일 추가에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 국경일 수정 (관리자 전용)
     */
    updateHoliday: async (id, updateData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await holidayService.updateHoliday(id, updateData);
        const { holidays } = get();
        const updatedHolidays = holidays.map(holiday => 
          holiday.holidayId === id ? response.data : holiday
        );
        set({ 
          holidays: updatedHolidays,
          isLoading: false 
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '국경일 수정에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 국경일 삭제 (관리자 전용)
     */
    deleteHoliday: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await holidayService.deleteHoliday(id);
        const { holidays } = get();
        const updatedHolidays = holidays.filter(holiday => holiday.holidayId !== id);
        set({ 
          holidays: updatedHolidays,
          isLoading: false 
        });
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '국경일 삭제에 실패했습니다', isLoading: false });
        throw error;
      }
    }
  }))
);

export default useHolidayStore;

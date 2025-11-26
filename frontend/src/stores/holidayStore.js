import { create } from 'zustand';
import api from '../services/api';

const useHolidayStore = create((set) => ({
  holidays: [],
  loading: false,
  error: null,

  fetchHolidays: async (year = new Date().getFullYear(), month = null) => {
    set({ loading: true, error: null });
    try {
      const params = { year };
      if (month) {
        params.month = month;
      }
      const response = await api.get('/holidays', { params });
      set({ holidays: response.data.data });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch holidays';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Admin function - assuming only admin can create/update
  createHoliday: async (holidayData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/holidays', holidayData);
      set((state) => ({ holidays: [...state.holidays, response.data.data] }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to create holiday';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateHoliday: async (holidayId, holidayData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/holidays/${holidayId}`, holidayData);
      set((state) => ({
        holidays: state.holidays.map((holiday) =>
          holiday.holidayId === holidayId ? { ...holiday, ...response.data.data } : holiday
        ),
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update holiday';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useHolidayStore;

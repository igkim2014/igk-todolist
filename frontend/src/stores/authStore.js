import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,

  // Action to set authentication state
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true, error: null });
  },

  // Action to clear authentication state
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  // Action to handle login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;
      set(useAuthStore.getState().setAuth(user, accessToken, refreshToken));
      return user;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Action to handle registration
  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { username, email, password });
      // Optionally auto-login after registration
      // const loginResponse = await api.post('/auth/login', { email, password });
      // const { user, accessToken, refreshToken } = loginResponse.data.data;
      // set(useAuthStore.getState().setAuth(user, accessToken, refreshToken));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Action to fetch user profile
  fetchUserProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/users/me');
      set({ user: response.data.data });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch user profile';
      set({ error: errorMessage });
      useAuthStore.getState().clearAuth(); // Clear auth if profile fetch fails
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Action to update user profile
  updateUserProfile: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch('/users/me', userData);
      set((state) => ({ user: { ...state.user, ...response.data.data } }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update user profile';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;

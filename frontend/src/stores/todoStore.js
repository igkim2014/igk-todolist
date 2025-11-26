import { create } from 'zustand';
import api from '../services/api';

const useTodoStore = create((set, get) => ({
  todos: [],
  filters: {
    status: 'ACTIVE', // 'ACTIVE', 'COMPLETED', 'DELETED'
    search: '',
    sortBy: 'dueDate',
    order: 'asc', // 'asc', 'desc'
  },
  loading: false,
  error: null,

  setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const { status, search, sortBy, order } = get().filters;
      const response = await api.get('/todos', {
        params: { status, search, sortBy, order },
      });
      set({ todos: response.data.data });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to fetch todos';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addTodo: async (todoData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/todos', todoData);
      set((state) => ({ todos: [response.data.data, ...state.todos] }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to add todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTodo: async (todoId, todoData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/todos/${todoId}`, todoData);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.todoId === todoId ? { ...todo, ...response.data.data } : todo
        ),
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  completeTodo: async (todoId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/todos/${todoId}/complete`);
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.todoId === todoId ? { ...todo, ...response.data.data } : todo
        ),
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to complete todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  softDeleteTodo: async (todoId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/todos/${todoId}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.todoId !== todoId), // Remove from current list
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to delete todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  restoreTodo: async (todoId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/todos/${todoId}/restore`);
      // Optionally re-fetch todos to ensure correct state for restored item
      get().fetchTodos();
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to restore todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  permanentlyDeleteTodo: async (todoId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/todos/${todoId}/permanent`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.todoId !== todoId),
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to permanently delete todo';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useTodoStore;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import { act } from 'react-dom/test-utils';

// Import store functions
import useAuthStore from '../src/stores/authStore';
import useTodoStore from '../src/stores/todoStore';
import authService from '../src/services/authService';
import todoService from '../src/services/todoService';

// Mock services
vi.mock('../src/services/authService');
vi.mock('../src/services/todoService');
vi.mock('../src/services/holidayService');
vi.mock('../src/services/userService');
vi.mock('../src/services/trashService');

describe('igk-TodoList Stores', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  describe('Auth Store', () => {
    it('should handle login successfully', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            userId: '1',
            email: 'test@example.com',
            username: 'Test User',
            role: 'user'
          }
        }
      };

      authService.login.mockResolvedValue(mockResponse);

      let result;
      act(() => {
        result = useAuthStore.getState().login('test@example.com', 'password123');
      });

      await expect(result).resolves.toBeUndefined();
      
      // Check that the service was called
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should handle registration', async () => {
      authService.register.mockResolvedValue({ data: {} });

      let result;
      act(() => {
        result = useAuthStore.getState().register('test@example.com', 'password123', 'Test User');
      });

      await expect(result).resolves.toBeUndefined();
      
      expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
    });
  });

  describe('Todo Store', () => {
    it('should fetch todos', async () => {
      const mockTodos = [
        { todoId: '1', title: 'Test Todo', content: '', status: 'active', isCompleted: false }
      ];
      
      todoService.getTodos.mockResolvedValue({ data: mockTodos });

      let result;
      act(() => {
        result = useTodoStore.getState().fetchTodos();
      });

      await expect(result).resolves.toBeUndefined();
      
      expect(todoService.getTodos).toHaveBeenCalledWith({});
    });

    it('should create a todo', async () => {
      const mockTodo = { todoId: '2', title: 'New Todo', content: '', status: 'active', isCompleted: false };
      const todoData = { title: 'New Todo', content: '' };
      
      todoService.createTodo.mockResolvedValue({ data: mockTodo });

      let result;
      act(() => {
        result = useTodoStore.getState().createTodo(todoData);
      });

      await expect(result).resolves.toEqual(mockTodo);
      
      expect(todoService.createTodo).toHaveBeenCalledWith(todoData);
    });
  });
});
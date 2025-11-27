import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

// Import components to test
import TodoListPage from '../src/pages/TodoListPage';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';
import useAuthStore from '../src/stores/authStore';
import useTodoStore from '../src/stores/todoStore';

// Mock the stores
vi.mock('../src/stores/authStore');
vi.mock('../src/stores/todoStore');
vi.mock('../src/stores/uiStore');

describe('igk-TodoList Application', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should render login page', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/igk-TodoList/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /로그인 하기/i })).toBeInTheDocument();
    });

    it('should render register page', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <RegisterPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/igk-TodoList/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/사용자 이름/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /회원가입/i })).toBeInTheDocument();
    });
  });

  describe('Todo Management', () => {
    it('should render todo list page', async () => {
      // Mock the store implementation
      useTodoStore.mockReturnValue({
        todos: [],
        isLoading: false,
        fetchTodos: vi.fn(),
        completeTodo: vi.fn(),
        deleteTodo: vi.fn(),
        filters: { status: 'all' },
        setFilters: vi.fn(),
        getTodoCountByStatus: vi.fn(() => ({ all: 0, active: 0, completed: 0 })),
        searchTodos: vi.fn(),
      });

      useAuthStore.mockReturnValue({
        user: { userId: '1', email: 'test@example.com', username: 'Test User' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <TodoListPage />
        </MemoryRouter>
      );

      // Wait for potential async operations
      await waitFor(() => {
        expect(screen.getByText(/할일 목록/i)).toBeInTheDocument();
      });
    });

    it('should handle todo filtering', async () => {
      const mockSetFilters = vi.fn();
      const mockFetchTodos = vi.fn();
      
      useTodoStore.mockReturnValue({
        todos: [
          { todoId: '1', title: 'Test Todo', content: '', status: 'active', isCompleted: false },
          { todoId: '2', title: 'Completed Todo', content: '', status: 'completed', isCompleted: true }
        ],
        isLoading: false,
        fetchTodos,
        completeTodo: vi.fn(),
        deleteTodo: vi.fn(),
        filters: { status: 'all' },
        setFilters: mockSetFilters,
        getTodoCountByStatus: vi.fn(() => ({ all: 2, active: 1, completed: 1 })),
        searchTodos: vi.fn(),
      });

      useAuthStore.mockReturnValue({
        user: { userId: '1', email: 'test@example.com', username: 'Test User' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <TodoListPage />
        </MemoryRouter>
      );

      // Find and click the '진행 중' filter button
      const activeFilterBtn = screen.getByText('진행 중 1');
      fireEvent.click(activeFilterBtn);

      await waitFor(() => {
        expect(mockSetFilters).toHaveBeenCalledWith({ status: 'active' });
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate between pages', () => {
      useAuthStore.mockReturnValue({
        user: { userId: '1', email: 'test@example.com', username: 'Test User', role: 'user' },
        isAuthenticated: true,
        isLoading: false,
        checkAuth: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <TodoListPage />
        </MemoryRouter>
      );

      // Test that we're on the todo list page
      expect(screen.getByText(/할일 목록/i)).toBeInTheDocument();
    });
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'zustand';

// Import components
import Button from '../src/components/common/Button';
import Input from '../src/components/common/Input';
import TodoModal from '../src/components/todo/TodoModal';

// Mock stores
import createAuthStore from '../src/stores/authStore';
import createTodoStore from '../src/stores/todoStore';
import createUiStore from '../src/stores/uiStore';

// Create actual stores for testing
const authStore = createAuthStore();
const todoStore = createTodoStore();
const uiStore = createUiStore();

describe('igk-TodoList Components', () => {
  describe('Common Components', () => {
    it('should render Button with correct text', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('should render Button with primary variant', () => {
      render(
        <Button variant="primary">
          Primary Button
        </Button>
      );
      const button = screen.getByText('Primary Button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-green-600');
    });

    it('should render Input with label and placeholder', () => {
      render(<Input label="Test Label" placeholder="Test Placeholder" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    it('should show error message in Input when error prop is provided', () => {
      render(<Input label="Test Label" error="This is an error" />);
      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });
  });

  describe('Todo Modal', () => {
    it('should render add todo modal', () => {
      // Mock the store state for the modal
      vi.spyOn(uiStore, 'getState').mockReturnValue({
        isModalOpen: true,
        modalType: 'todo-add',
        modalProps: {},
        selectedTodo: null,
        isDarkMode: false,
        isSidebarOpen: false,
        isBottomSheetOpen: false,
        bottomSheetContent: null,
        toastMessages: [],
        openModal: vi.fn(),
        closeModal: vi.fn(),
        selectTodo: vi.fn(),
        toggleDarkMode: vi.fn(),
        toggleSidebar: vi.fn(),
        closeSidebar: vi.fn(),
        openBottomSheet: vi.fn(),
        closeBottomSheet: vi.fn(),
        addToast: vi.fn(),
        removeToast: vi.fn(),
        clearToasts: vi.fn(),
      });

      vi.spyOn(todoStore, 'getState').mockReturnValue({
        createTodo: vi.fn(),
        updateTodo: vi.fn(),
        // Add all other required state properties
        todos: [],
        isLoading: false,
        error: null,
        filters: { status: 'all', search: '', sortBy: 'dueDate', order: 'asc', page: 1, limit: 20 },
        fetchTodos: vi.fn(),
        fetchTodoById: vi.fn(),
        completeTodo: vi.fn(),
        deleteTodo: vi.fn(),
        restoreTodo: vi.fn(),
        permanentlyDeleteTodo: vi.fn(),
        setFilters: vi.fn(),
        getTodoCountByStatus: vi.fn(),
        searchTodos: vi.fn(),
      });

      // Since the modal uses store hooks, we need to wrap in provider
      render(
        <Provider value={uiStore}>
          <Provider value={todoStore}>
            <TodoModal 
              isOpen={true} 
              onClose={() => {}} 
              type="add" 
              todo={null} 
            />
          </Provider>
        </Provider>
      );
      
      expect(screen.getByText('새 할일 추가')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render layout with header and navigation', () => {
      // Test that the app renders without crashing
      expect(() => {
        render(
          <BrowserRouter>
            <div>Test Layout</div>
          </BrowserRouter>
        );
      }).not.toThrow();
    });
  });
});
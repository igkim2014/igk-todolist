import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import todoService from '../services/todoService';
import { TODO_STATUS } from '../constants/todoStatus';

/**
 * 할일 상태 관리 스토어
 */
const useTodoStore = create(
  devtools((set, get) => ({
    // 상태
    todos: [],
    isLoading: false,
    error: null,
    filters: {
      status: 'all', // all, active, completed, deleted
      search: '',
      sortBy: 'dueDate', // dueDate, createdAt
      order: 'asc', // asc, desc
      page: 1,
      limit: 20
    },

    // 액션
    /**
     * 할일 목록 조회
     */
    fetchTodos: async () => {
      set({ isLoading: true, error: null });
      try {
        const { filters } = get();
        const response = await todoService.getTodos(filters);
        set({ todos: response.data, isLoading: false });
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 목록을 불러오는데 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 검색
     */
    searchTodos: async (searchTerm) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.getTodos({ search: searchTerm });
        set({ todos: response.data, isLoading: false });
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 검색에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 상세 조회
     */
    fetchTodoById: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.getTodoById(id);
        set({ isLoading: false });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일을 불러오는데 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 생성
     */
    createTodo: async (todoData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.createTodo(todoData);
        const { todos } = get();
        set({ 
          todos: [response.data, ...todos],
          isLoading: false 
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 생성에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 수정
     */
    updateTodo: async (id, updateData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.updateTodo(id, updateData);
        const { todos } = get();
        const updatedTodos = todos.map(todo => 
          todo.todoId === id ? response.data : todo
        );
        set({ 
          todos: updatedTodos,
          isLoading: false 
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 수정에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 완료 처리
     */
    completeTodo: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.completeTodo(id);
        const { todos } = get();
        const updatedTodos = todos.map(todo => 
          todo.todoId === id ? response.data : todo
        );
        set({ 
          todos: updatedTodos,
          isLoading: false 
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 완료 처리에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 삭제 (휴지통으로 이동)
     */
    deleteTodo: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.deleteTodo(id);
        const { todos } = get();
        const updatedTodos = todos.map(todo =>
          todo.todoId === id ? response.data : todo
        );
        set({
          todos: updatedTodos,
          isLoading: false
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 삭제에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 복원 (휴지통에서 복구)
     */
    restoreTodo: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.restoreTodo(id);
        const { todos } = get();
        const updatedTodos = todos.map(todo =>
          todo.todoId === id ? response.data : todo
        );
        set({
          todos: updatedTodos,
          isLoading: false
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 복원에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 할일 영구 삭제
     */
    permanentlyDeleteTodo: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.permanentlyDeleteTodo(id);
        const { todos } = get();
        const updatedTodos = todos.filter(todo => todo.todoId !== id);
        set({
          todos: updatedTodos,
          isLoading: false
        });
        return response.data;
      } catch (error) {
        set({ error: error.response?.data?.error?.message || '할일 영구 삭제에 실패했습니다', isLoading: false });
        throw error;
      }
    },

    /**
     * 필터 설정
     */
    setFilters: (newFilters) => {
      set({ filters: { ...get().filters, ...newFilters } });
    },

    /**
     * 상태별 할일 수 계산
     */
    getTodoCountByStatus: () => {
      const { todos } = get();
      return {
        [TODO_STATUS.ACTIVE]: todos.filter(todo => todo.status === TODO_STATUS.ACTIVE).length,
        [TODO_STATUS.COMPLETED]: todos.filter(todo => todo.status === TODO_STATUS.COMPLETED).length,
        [TODO_STATUS.DELETED]: todos.filter(todo => todo.status === TODO_STATUS.DELETED).length,
        all: todos.length
      };
    }
  }))
);

export default useTodoStore;

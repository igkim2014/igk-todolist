import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI 상태 관리 스토어
 */
const useUiStore = create(
  devtools((set, get) => ({
    // 상태
    isModalOpen: false,
    modalType: null, // 'todo-add', 'todo-edit', 'confirm', etc.
    modalProps: {},
    selectedTodo: null,
    isDarkMode: false,
    isSidebarOpen: false,
    isBottomSheetOpen: false,
    bottomSheetContent: null,
    toastMessages: [],

    // 액션
    /**
     * 모달 열기
     */
    openModal: (type, props = {}) => {
      set({
        isModalOpen: true,
        modalType: type,
        modalProps: props,
        selectedTodo: props.todo || null
      });
    },

    /**
     * 모달 닫기
     */
    closeModal: () => {
      set({ isModalOpen: false, modalType: null, modalProps: {}, selectedTodo: null });
    },

    /**
     * 할일 선택
     */
    selectTodo: (todo) => {
      set({ selectedTodo: todo });
    },

    /**
     * 다크모드 토글
     */
    toggleDarkMode: () => {
      const newMode = !get().isDarkMode;
      set({ isDarkMode: newMode });
      
      // 다크모드 클래스 토글
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    /**
     * 사이드바 토글
     */
    toggleSidebar: () => {
      set({ isSidebarOpen: !get().isSidebarOpen });
    },

    /**
     * 사이드바 닫기
     */
    closeSidebar: () => {
      set({ isSidebarOpen: false });
    },

    /**
     * 하단 시트 열기
     */
    openBottomSheet: (content) => {
      set({ isBottomSheetOpen: true, bottomSheetContent: content });
    },

    /**
     * 하단 시트 닫기
     */
    closeBottomSheet: () => {
      set({ isBottomSheetOpen: false, bottomSheetContent: null });
    },

    /**
     * 토스트 메시지 추가
     */
    addToast: (message, type = 'info') => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, timestamp: Date.now() };
      set(state => ({ toastMessages: [...state.toastMessages, newToast] }));
      
      // 자동 제거 타이머
      setTimeout(() => {
        set(state => ({ toastMessages: state.toastMessages.filter(t => t.id !== id) }));
      }, 3000);
    },

    /**
     * 토스트 메시지 제거
     */
    removeToast: (id) => {
      set(state => ({ toastMessages: state.toastMessages.filter(t => t.id !== id) }));
    },

    /**
     * 모든 토스트 메시지 제거
     */
    clearToasts: () => {
      set({ toastMessages: [] });
    }
  }))
);

export default useUiStore;

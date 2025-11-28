import React, { useEffect, useState } from 'react';
import { Plus, Filter, Calendar, CheckCircle, Circle, AlertCircle, Search, X } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import useUiStore from '../stores/uiStore';
import { TODO_STATUS, TODO_STATUS_LABELS, TODO_STATUS_COLORS } from '../constants/todoStatus';
import { formatDate, isPast } from '../utils/dateFormatter';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import TodoModal from '../components/todo/TodoModal';

const TodoListPage = () => {
  const {
    todos,
    isLoading,
    fetchTodos,
    searchTodos,
    completeTodo,
    deleteTodo,
    filters,
    setFilters,
    getTodoCountByStatus
  } = useTodoStore();

  const {
    openModal,
    isModalOpen,
    modalType,
    modalProps,
    closeModal
  } = useUiStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = () => {
    openModal('todo-add');
  };

  const handleCompleteTodo = async (id) => {
    try {
      await completeTodo(id);
    } catch (error) {
      console.error('Failed to complete todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    openModal('todo-edit', { todo });
  };

  const handleFilterChange = (status) => {
    setFilters({ status });
  };

  const counts = getTodoCountByStatus();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchTodos(searchTerm);
    } else {
      await fetchTodos();
    }
  };

  const clearSearch = async () => {
    setSearchTerm('');
    await fetchTodos();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 및 필터 섹션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">할일 목록</h1>

        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="할일 검색..."
                className="border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="outline" className="flex items-center">
              <Search className="h-4 w-4 mr-1" />
              검색
            </Button>
          </form>
          <Button variant="primary" onClick={handleAddTodo} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            새 할일 추가
          </Button>
        </div>
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
        {[
          { key: 'all', label: `전체 ${counts.all}` },
          { key: TODO_STATUS.ACTIVE, label: `진행 중 ${counts.active}` },
          { key: TODO_STATUS.COMPLETED, label: `완료 ${counts.completed}` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key === 'all' ? 'all' : key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.status === (key === 'all' ? 'all' : key)
                ? 'bg-white text-green-600 shadow-sm dark:bg-gray-600 dark:text-white'
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 할일 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <CheckCircle className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">할일이 없습니다</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            새 할일을 추가하여 시작해보세요.
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={handleAddTodo}>
              할일 추가하기
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {todos
            .filter(todo =>
              filters.status === 'all'
                ? todo.status !== TODO_STATUS.DELETED
                : filters.status === TODO_STATUS.COMPLETED
                  ? todo.isCompleted
                  : !todo.isCompleted && todo.status !== TODO_STATUS.DELETED
            )
            .map((todo) => {
              const isOverdue = isPast(todo.dueDate) && !todo.isCompleted;
              const statusColor = TODO_STATUS_COLORS[todo.status] || 'gray';

              return (
                <div
                  key={todo.todoId}
                  className={`border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700 ${isOverdue ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleCompleteTodo(todo.todoId)}
                      className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${todo.isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                    >
                      {todo.isCompleted && <CheckCircle className="h-4 w-4 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium truncate ${todo.isCompleted
                            ? 'text-gray-500 dark:text-gray-400 line-through'
                            : 'text-gray-900 dark:text-white'
                          }`}>
                          {todo.title}
                        </h3>
                        <Badge
                          variant={todo.isCompleted ? 'success' : isOverdue ? 'danger' : 'secondary'}
                        >
                          {todo.isCompleted
                            ? '완료'
                            : isOverdue
                              ? '기한지남'
                              : TODO_STATUS_LABELS[todo.status]}
                        </Badge>
                      </div>

                      {todo.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {todo.content}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {todo.startDate && todo.dueDate
                              ? `${formatDate(todo.startDate)} ~ ${formatDate(todo.dueDate)}`
                              : todo.dueDate
                                ? `~ ${formatDate(todo.dueDate)}`
                                : '기한 없음'}
                          </span>
                        </div>

                        {isOverdue && (
                          <div className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span>기한 지남</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTodo(todo)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.todoId)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 할일 추가/수정 모달 */}
      <TodoModal
        isOpen={isModalOpen && (modalType === 'todo-add' || modalType === 'todo-edit')}
        onClose={closeModal}
        type={modalType === 'todo-add' ? 'add' : 'edit'}
        todo={modalType === 'todo-edit' ? modalProps.todo : null}
      />
    </div>
  );
};

export default TodoListPage;

import React, { useEffect } from 'react';
import { Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import useTodoStore from '../stores/todoStore';
import useUiStore from '../stores/uiStore';
import { formatDate } from '../utils/dateFormatter';
import Button from '../components/common/Button';

const TrashPage = () => {
  const {
    todos,
    isLoading,
    fetchTodos,
    restoreTodo,
    permanentlyDeleteTodo
  } = useTodoStore();
  
  const { openModal } = useUiStore();

  useEffect(() => {
    // 휴지통 할일만 불러오기 - status가 deleted인 것들
    fetchTodos({ status: 'deleted' });
  }, [fetchTodos]);

  const handleRestoreTodo = async (id) => {
    try {
      await restoreTodo(id);
      // 목록 다시 불러오기
      fetchTodos({ status: 'deleted' });
    } catch (error) {
      console.error('Failed to restore todo:', error);
    }
  };

  const handlePermanentlyDelete = async (id) => {
    if (window.confirm('정말로 이 할일을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await permanentlyDeleteTodo(id); // 실제로는 서비스에서 영구 삭제 API 호출 필요
        // 목록 다시 불러오기
        fetchTodos({ status: 'deleted' });
      } catch (error) {
        console.error('Failed to permanently delete todo:', error);
      }
    }
  };

  const handleAddTodo = () => {
    openModal('todo-add');
  };

  // 삭제된 할일만 필터링
  const deletedTodos = todos.filter(todo => todo.status === 'deleted');

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">휴지통</h1>
          <p className="text-gray-600 dark:text-gray-400">
            삭제된 할일 ({deletedTodos.length}개) - 30일 후 자동으로 영구 삭제됩니다
          </p>
        </div>
        
        <Button variant="primary" onClick={handleAddTodo} className="flex items-center">
          <Trash2 className="h-4 w-4 mr-1" />
          새 할일 추가
        </Button>
      </div>

      {/* 할일 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : deletedTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <Trash2 className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">휴지통이 비어 있습니다</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            삭제된 할일이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deletedTodos.map((todo) => (
            <div 
              key={todo.todoId} 
              className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <Trash2 className="h-3 w-3 text-gray-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-500 dark:text-gray-400 line-through">
                      {todo.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      삭제됨
                    </span>
                  </div>
                  
                  {todo.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {todo.content}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>삭제 시간: {formatDate(todo.deletedAt || todo.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestoreTodo(todo.todoId)}
                    className="flex items-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    복원
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handlePermanentlyDelete(todo.todoId)}
                    className="flex items-center"
                  >
                    영구 삭제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;

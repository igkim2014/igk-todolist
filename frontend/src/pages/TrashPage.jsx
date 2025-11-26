import React, { useEffect, useState } from 'react';
import useTodoStore from '../stores/todoStore';
import useAuthStore from '../stores/authStore';
import TodoCard from '../components/todo/TodoCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

function TrashPage() {
  const { todos, filters, loading, error, fetchTodos, setFilters, restoreTodo, permanentlyDeleteTodo } = useTodoStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Specifically fetch deleted todos for this page
      setFilters({ status: 'DELETED', search: '' });
      fetchTodos();
    }
    // Cleanup filters when leaving page (optional but good practice)
    return () => {
        setFilters({ status: 'ACTIVE' });
    }
  }, [isAuthenticated, fetchTodos, setFilters]);

  const handleRestore = async (todoId) => {
    if (confirm('Are you sure you want to restore this todo?')) {
        await restoreTodo(todoId);
        fetchTodos(); // Refresh list
    }
  };

  const handlePermanentDeleteClick = (todoId) => {
    setDeleteConfirmId(todoId);
  };

  const confirmPermanentDelete = async () => {
    if (deleteConfirmId) {
      await permanentlyDeleteTodo(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchTodos(); // Refresh list
    }
  };

  if (loading) return <div className="text-center text-lg">Loading trash...</div>;
  if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Trash 🗑️</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Items in trash can be restored or permanently deleted.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">Trash is empty.</p>
        ) : (
          todos.map((todo) => (
            <TodoCard
              key={todo.todoId}
              todo={todo}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDeleteClick}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Permanent Delete"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to permanently delete this todo? This action <strong>cannot be undone</strong>.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmPermanentDelete}>Permanently Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default TrashPage;

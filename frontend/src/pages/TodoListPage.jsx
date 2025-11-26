import React, { useEffect, useState } from 'react';
import useTodoStore from '../stores/todoStore';
import useAuthStore from '../stores/authStore';
import TodoCard from '../components/todo/TodoCard';
import TodoForm from '../components/todo/TodoForm';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal'; // Ensure Modal is imported

function TodoListPage() {
  const { todos, filters, loading, error, fetchTodos, addTodo, updateTodo, softDeleteTodo, completeTodo, setFilters } = useTodoStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated, fetchTodos, filters.status, filters.sortBy, filters.order]);

  useEffect(() => {
    // Debounce search term
    const handler = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, setFilters]);

  const handleAddTodo = () => {
    setCurrentTodo(null);
    setIsFormModalOpen(true);
  };

  const handleEditTodo = (todo) => {
    setCurrentTodo(todo);
    setIsFormModalOpen(true);
  };

  const handleSubmitTodo = async (todoData) => {
    if (currentTodo) {
      await updateTodo(currentTodo.todoId, todoData);
    } else {
      await addTodo(todoData);
    }
    fetchTodos(); // Re-fetch to update list with new/updated item
  };

  const handleFilterChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleSortByChange = (e) => {
    setFilters({ sortBy: e.target.value });
  };

  const handleOrderChange = (e) => {
    setFilters({ order: e.target.value });
  };

  if (loading) return <div className="text-center text-lg">Loading todos...</div>;
  if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Todos</h2>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <Button onClick={handleAddTodo} variant="primary">
          Add New Todo
        </Button>

        <div className="flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />

          <select
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ALL">All (excluding deleted)</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={handleSortByChange}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
          </select>

          <select
            value={filters.order}
            onChange={handleOrderChange}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.length === 0 ? (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">No todos found.</p>
        ) : (
          todos.map((todo) => (
            <TodoCard
              key={todo.todoId}
              todo={todo}
              onEdit={handleEditTodo}
              onDelete={softDeleteTodo}
              onComplete={completeTodo}
            />
          ))
        )}
      </div>

      <TodoForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitTodo}
        initialData={currentTodo}
      />
    </div>
  );
}

export default TodoListPage;

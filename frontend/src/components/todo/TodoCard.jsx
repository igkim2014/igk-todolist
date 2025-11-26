import React from 'react';
import Button from '../common/Button';

const TodoCard = ({ todo, onEdit, onDelete, onComplete, onRestore, onPermanentDelete }) => {
  const isCompleted = todo.isCompleted;
  const isDeleted = todo.status === 'DELETED';
  const overdue = !isCompleted && todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <div
      className={`p-4 mb-3 rounded-lg shadow-md transition-all duration-300
      ${isCompleted ? 'bg-green-100 dark:bg-green-900 opacity-75' : ''}
      ${isDeleted ? 'bg-gray-200 dark:bg-gray-700 opacity-60' : ''}
      ${overdue && !isDeleted && !isCompleted ? 'bg-red-100 dark:bg-red-900' : 'bg-white dark:bg-gray-800'}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
          >
            {todo.title}
            {overdue && <span className="ml-2 text-red-700 dark:text-red-300 text-sm">(Overdue)</span>}
          </h3>
          {todo.content && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{todo.content}</p>
          )}
          {(todo.startDate || todo.dueDate) && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {todo.startDate && `Start: ${new Date(todo.startDate).toLocaleDateString()}`}
              {todo.startDate && todo.dueDate && ' - '}
              {todo.dueDate && `Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {!isDeleted && !isCompleted && (
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => onComplete(todo.todoId)}
              className="form-checkbox h-5 w-5 text-green-600 dark:bg-gray-700 dark:border-gray-600 rounded"
              title="Mark as complete"
            />
          )}

          {!isDeleted && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(todo)} title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Button>
          )}

          {isDeleted ? (
            <>
              <Button variant="primary" size="sm" onClick={() => onRestore(todo.todoId)} title="Restore">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 2.972 1.492 5.645 3.737 7.352M19.428 11.428a8.001 8.001 0 00-15.356 2m15.356-2H20v-5" />
                </svg>
              </Button>
              <Button variant="danger" size="sm" onClick={() => onPermanentDelete(todo.todoId)} title="Permanently Delete">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </>
          ) : (
            <Button variant="danger" size="sm" onClick={() => onDelete(todo.todoId)} title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoCard;

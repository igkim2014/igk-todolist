import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal'; // Assuming Modal is available

const TodoForm = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
      setError('');
    } else if (isOpen) {
      // Reset form when opening for new todo
      setTitle('');
      setContent('');
      setStartDate('');
      setDueDate('');
      setError('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
      setError('Due date cannot be before start date');
      return;
    }

    try {
      await onSubmit({ title, content, startDate, dueDate });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save todo.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData.todoId ? 'Edit Todo' : 'Add New Todo'}>
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Todo Title"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Content"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Details (Optional)"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData.todoId ? 'Save Changes' : 'Add Todo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoForm;

import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import useTodoStore from '../../stores/todoStore';
import { isValidDate, isValidDateRange } from '../../utils/validator';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const TodoModal = ({ isOpen, onClose, type, todo }) => {
  const { createTodo, updateTodo } = useTodoStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    dueDate: '',
    isCompleted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때 기존 데이터 로드
  useEffect(() => {
    if (type === 'edit' && todo) {
      setFormData({
        title: todo.title || '',
        content: todo.content || '',
        startDate: todo.startDate || '',
        dueDate: todo.dueDate || '',
        isCompleted: todo.isCompleted || false
      });
    } else if (type === 'add') {
      setFormData({
        title: '',
        content: '',
        startDate: '',
        dueDate: '',
        isCompleted: false
      });
    }
  }, [type, todo, isOpen]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
    
    // 실시간 유효성 검사 해제
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }
    
    if (formData.startDate && !isValidDate(formData.startDate)) {
      newErrors.startDate = '올바른 날짜 형식이 아닙니다.';
    }
    
    if (formData.dueDate && !isValidDate(formData.dueDate)) {
      newErrors.dueDate = '올바른 날짜 형식이 아닙니다.';
    }
    
    if (formData.startDate && formData.dueDate && !isValidDateRange(formData.startDate, formData.dueDate)) {
      newErrors.dueDate = '만료일은 시작일과 같거나 이후여야 합니다.';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (type === 'add') {
        await createTodo(formData);
      } else if (type === 'edit') {
        await updateTodo(todo.todoId, formData);
      }
      onClose();
    } catch (error) {
      console.error(`${type === 'add' ? '생성' : '수정'} 실패:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={type === 'add' ? '새 할일 추가' : '할일 수정'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="제목 *"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="할일 제목을 입력하세요"
          error={errors.title}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            내용
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="할일 내용을 입력하세요"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              시작일
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              만료일
            </label>
            <div className="relative">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
          </div>
        </div>
        
        {type === 'edit' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              완료로 표시
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
            {type === 'add' ? '추가' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoModal;

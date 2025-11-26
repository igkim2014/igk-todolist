import React from 'react';

const Input = ({ label, id, type = 'text', className = '', ...props }) => {
  const baseStyles = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600';
  
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`${baseStyles} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;

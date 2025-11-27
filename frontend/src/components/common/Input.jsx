import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input 컴포넌트
 * @param {string} label - 레이블 텍스트
 * @param {string} type - 입력 필드 타입
 * @param {string} placeholder - 플레이스홀더 텍스트
 * @param {string} error - 에러 메시지
 * @param {boolean} required - 필수 입력 여부
 * @param {string} className - 추가 클래스명
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  error,
  required = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const hasError = !!error;

  const containerClasses = [
    'space-y-1 w-full',
    className,
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors',
    hasError 
      ? 'border-red-500 focus:ring-red-500 focus:ring-1' 
      : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
    Icon ? 'pl-10' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
      </div>
      {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.elementType,
};

export default Input;

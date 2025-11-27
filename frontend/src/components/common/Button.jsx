import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Button 컴포넌트
 * @param {string} variant - primary, secondary, danger, outline, ghost
 * @param {string} size - sm, md, lg
 * @param {boolean} isLoading - 로딩 상태
 * @param {boolean} disabled - 비활성화 상태
 * @param {ReactNode} children - 버튼 내용
 * @param {string} className - 추가 클래스명
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Variant에 따른 스타일
  const variantStyles = {
    primary: 'bg-green-600 hover:bg-green-700 text-white border border-green-600',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600',
    outline: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 border border-transparent',
  };

  // Size에 따른 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const isDisabled = disabled || isLoading;
  
  const classes = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className,
    isDisabled ? 'cursor-not-allowed' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};

export default Button;

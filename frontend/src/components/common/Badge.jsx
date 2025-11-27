import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge 컴포넌트
 * @param {string} variant - 배지 타입 (primary, secondary, success, warning, danger)
 * @param {ReactNode} children - 배지 내용
 * @param {string} className - 추가 클래스명
 */
const Badge = ({ variant = 'secondary', children, className = '' }) => {
  const variantStyles = {
    primary: 'bg-green-100 text-green-800 border-green-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const classes = [
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantStyles[variant],
    className,
  ].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;

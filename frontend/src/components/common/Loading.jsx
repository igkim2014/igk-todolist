import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading 컴포넌트
 * @param {string} size - 로딩 크기 (sm, md, lg)
 * @param {string} className - 추가 클래스명
 */
const Loading = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`animate-spin text-green-600 ${sizeClasses[size]} ${className}`} />
    </div>
  );
};

export default Loading;

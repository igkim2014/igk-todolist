import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * Alert 컴포넌트
 * @param {string} type - alert 타입 (success, error, warning, info)
 * @param {string} message - 알림 메시지
 * @param {boolean} showIcon - 아이콘 표시 여부
 * @param {function} onClose - 닫기 함수
 */
const Alert = ({ type = 'info', message, showIcon = true, onClose }) => {
  const typeStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-500',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-500',
    },
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];
  const style = typeStyles[type];

  return (
    <div className={`border rounded-lg p-4 ${style.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {showIcon && <Icon className={`h-5 w-5 ${style.icon}`} />}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <XCircle className="h-5 w-5 opacity-50 hover:opacity-100" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Alert;

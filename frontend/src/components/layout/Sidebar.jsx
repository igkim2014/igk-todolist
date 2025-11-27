import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Trash2,
  Calendar,
  User,
  Settings,
  CalendarPlus,
  Home
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: 'home',
      label: '홈',
      path: '/',
      icon: Home,
      visible: true
    },
    {
      id: 'todos',
      label: '할일 목록',
      path: '/',
      icon: ListTodo,
      visible: true
    },
    {
      id: 'trash',
      label: '휴지통',
      path: '/trash',
      icon: Trash2,
      visible: true
    },
    {
      id: 'holidays',
      label: '국경일',
      path: '/holidays',
      icon: Calendar,
      visible: true
    },
    {
      id: 'profile',
      label: '프로필',
      path: '/profile',
      icon: User,
      visible: true
    },
    {
      id: 'admin-holidays',
      label: '국경일 관리',
      path: '/admin/holidays',
      icon: CalendarPlus,
      visible: user?.role === 'admin'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // 현재 경로에 따른 활성 메뉴 아이템 확인
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-gray-50 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-40 transition-transform lg:translate-x-0 lg:static lg:h-screen lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'w-64' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.filter(item => item.visible).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-green-100 text-green-700 border-l-4 border-green-600 dark:bg-green-900/30 dark:text-green-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IGK-TodoList</h1>
      <nav>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">Hello, {user.username}</span>
            <Button variant="secondary" onClick={() => navigate('/profile')}>
              Profile
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-x-4">
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

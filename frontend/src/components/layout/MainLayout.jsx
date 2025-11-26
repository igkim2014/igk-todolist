import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { useEffect } from 'react';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserProfile().catch(() => {
        // Handle error, e.g., token expired, redirect to login
        navigate('/login');
      });
    }
  }, [isAuthenticated, user, fetchUserProfile, navigate]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

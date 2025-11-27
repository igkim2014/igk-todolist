import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import App from './App';

// 페이지 컴포넌트 - 나중에 생성될 예정
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const TodoListPage = React.lazy(() => import('./pages/TodoListPage'));
const TrashPage = React.lazy(() => import('./pages/TrashPage'));
const HolidayPage = React.lazy(() => import('./pages/HolidayPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AdminHolidayPage = React.lazy(() => import('./pages/AdminHolidayPage'));

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// Protected Route 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return children;
};

// Admin Route 컴포넌트
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    window.location.href = '/';
    return null;
  }

  return children;
};

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <TodoListPage />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </React.Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </React.Suspense>
    ),
  },
  {
    path: '/trash',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <TrashPage />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/holidays',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <HolidayPage />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <ProfilePage />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/holidays',
    element: (
      <AdminRoute>
        <React.Suspense fallback={<LoadingFallback />}>
          <AdminHolidayPage />
        </React.Suspense>
      </AdminRoute>
    ),
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;

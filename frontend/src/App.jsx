import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage'; // To be created
import TrashPage from './pages/TrashPage'; // To be created
import HolidayPage from './pages/HolidayPage'; // To be created
import ProfilePage from './pages/ProfilePage'; // To be created
import MainLayout from './components/layout/MainLayout'; // To be created

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <TodoListPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <PrivateRoute>
              <MainLayout>
                <TrashPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/holidays"
          element={
            <PrivateRoute>
              <MainLayout>
                <HolidayPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* Add more protected routes here */}
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../service/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
};
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Check both token from context and localStorage as fallback
  const hasToken = token || localStorage.getItem('token');

  return hasToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;


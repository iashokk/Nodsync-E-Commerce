// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // If `currentUser` is still `null` here *and* auth is done initializing,
  // we know there is no logged-in user. Redirect to sign-in.
  return currentUser
    ? children
    : <Navigate to="/signin" replace />;
}

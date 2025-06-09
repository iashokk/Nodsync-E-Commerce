// Import React library for building UI components
import React from 'react';
// Import Navigate component from react-router-dom for navigation
import { Navigate } from 'react-router-dom';
// Import useAuth hook from AuthContext to access authentication state
import { useAuth } from '../contexts/AuthContext';


export default function PrivateRoute({ children }) {
    // Destructure currentUser from the useAuth hook to get the current authentication state
    const { currentUser } = useAuth();

    // Check if there is a logged-in user (currentUser is not null)
    // If a user is logged in, render the children components
    // Otherwise, redirect to the "/signin" route using the Navigate component
    return currentUser
        ? children // Render children if user is authenticated
        : <Navigate to="/signin" replace />; // Redirect to sign-in page if not authenticated
}

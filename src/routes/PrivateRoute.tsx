import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// List of public authentication pages
const PUBLIC_AUTH_PAGES = [
  '/login', 
  '/esqueci-a-senha', 
  '/alterar-senha', 
  '/cadastro'
];

interface PrivateRouteProps {
    children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Check if the current path is a public authentication page
    const isPublicAuthPage = PUBLIC_AUTH_PAGES.some(path => 
        location.pathname.startsWith(path)
    );

    // If it's a public auth page, always allow access
    if (isPublicAuthPage) {
        return <>{children}</>;
    }

    // For non-public routes, check authentication
    if (!isAuthenticated) {
        // Redirect to login page, but save the current location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

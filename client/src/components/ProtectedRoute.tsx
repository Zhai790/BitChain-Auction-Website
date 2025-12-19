import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'ARTIST' | 'COLLECTOR';
}

export function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps): JSX.Element {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // If not logged in, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // For artist and collector pages, enforce role-based access
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to their own page based on their role
        const defaultPath = user.role === 'ARTIST' ? '/artist' : '/collector';
        return <Navigate to={defaultPath} replace />;
    }

    return <>{children}</>;
}

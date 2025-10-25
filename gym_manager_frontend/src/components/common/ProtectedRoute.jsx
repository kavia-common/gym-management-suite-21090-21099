import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader';
import { useAuthStore } from '../../store/authStore';

/**
 * ProtectedRoute gates children based on a single derived auth state:
 * - initialized: auth bootstrap complete
 * - authenticated: session present
 * Redirects to /auth/sign-in when unauthenticated.
 */

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  const location = useLocation();
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);

  if (!initialized) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Loader text="Checking authentication..." />
      </div>
    );
  }

  const authenticated = Boolean(session);
  if (!authenticated) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location.pathname || '/' }}
      />
    );
  }

  return <Outlet />;
}

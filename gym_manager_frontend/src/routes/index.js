import React, { createContext, useContext, useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

/**
 * PUBLIC_INTERFACE
 * useAuth provides access to temporary stubbed auth state.
 * Replace internals with Supabase in Step 3.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider wraps the app and provides a temporary authentication state.
 * This will be replaced by Supabase in Step 3; currently persists to memory only.
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo(
    () => ({
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards access to private areas based on stubbed auth.
 * If not authenticated, redirects to /auth/sign-in with redirect back to the requested location.
 */
export function ProtectedRoute() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}

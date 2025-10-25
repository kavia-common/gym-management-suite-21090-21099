import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../store/authStore";

// Shape of the auth context
// PUBLIC_INTERFACE
export const AuthContext = createContext({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  // Methods
  signInWithPassword: async (_email, _password) => ({ data: null, error: null }),
  signUpWithPassword: async (_email, _password, _emailRedirectTo) => ({ data: null, error: null }),
  sendPasswordReset: async (_email, _redirectTo) => ({ data: null, error: null }),
  updatePassword: async (_newPassword) => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
});

/**
 * PUBLIC_INTERFACE
 * useAuth exposes real authentication state from Supabase.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider wires Supabase auth into React context with session persistence.
 * Subscribes to onAuthStateChange and keeps user/session in sync.
 */
export function AuthProvider({ children }) {
  // Use local state to preserve context shape; hydrate from the auth store
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Zustand auth watcher and mirror its state into React context state
  useEffect(() => {
    const unsubStore = useAuthStore.subscribe(
      (s) => ({ session: s.session, user: s.user, loading: s.loading }),
      (next, _prev) => {
        setSession(next.session);
        setUser(next.user);
        setLoading(next.loading);
      }
    );
    // Ensure watcher is started
    useAuthStore.getState().initAuthWatcher();

    // Seed initial state synchronously
    const s = useAuthStore.getState();
    setSession(s.session);
    setUser(s.user);
    setLoading(s.loading);

    return () => unsubStore?.();
  }, []);

  // Supabase-backed auth methods, routed via the store to keep a single source of truth
  const signInWithPassword = (email, password) => useAuthStore.getState().signInWithPassword(email, password);
  const signUpWithPassword = (email, password, emailRedirectTo) =>
    useAuthStore.getState().signUpWithPassword(email, password, emailRedirectTo);
  const sendPasswordReset = (email, redirectTo) => useAuthStore.getState().sendPasswordReset(email, redirectTo);
  const updatePassword = (newPassword) => useAuthStore.getState().updatePassword(newPassword);
  const signOut = () => useAuthStore.getState().signOut();

  const value = useMemo(
    () => ({
      user,
      session,
      isAuthenticated: !!user,
      loading,
      signInWithPassword,
      signUpWithPassword,
      sendPasswordReset,
      updatePassword,
      signOut,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards access to private areas based on Supabase auth.
 * If not authenticated, redirects to /auth/sign-in with redirect back to the requested location.
 */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    // Minimal inline loader to avoid importing extra components here
    return (
      <div className="container" style={{ padding: 24 }}>
        <div className="text-muted">Checking authentication…</div>
      </div>
    );
  }
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
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
 *
 * Fixes:
 * - Ensure we eagerly fetch supabase.auth.getSession() on mount if store hasn't resolved yet.
 * - Always clear loading state so UI doesn't get stuck on "Checking authentication…".
 * - Clean up store/watchers on unmount.
 */
export function AuthProvider({ children }) {
  // Use local state to preserve context shape; hydrate from the auth store
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Zustand auth store updates
    const unsubStore = useAuthStore.subscribe(
      (s) => ({ session: s.session, user: s.user, loading: s.loading }),
      (next, _prev) => {
        setSession(next.session);
        setUser(next.user);
        setLoading(next.loading);
      }
    );

    // Ensure watcher is started
    const store = useAuthStore.getState();
    store.initAuthWatcher();

    // Seed initial state synchronously from store
    const s = useAuthStore.getState();
    setSession(s.session);
    setUser(s.user);
    setLoading(s.loading);

    // Defensive: if still loading after a short tick, force-check Supabase session to avoid hanging
    let mounted = true;
    const timeout = setTimeout(async () => {
      if (!mounted) return;
      if (useAuthStore.getState().loading) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            // eslint-disable-next-line no-console
            console.warn("Supabase getSession warning:", error.message || error);
          }
          const sess = data?.session ?? null;
          const usr = sess?.user ?? null;
          // Mirror to local state in case store missed it for any reason
          setSession(sess);
          setUser(usr);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Supabase getSession threw:", e?.message || e);
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      unsubStore?.();
      // Clean up auth watcher
      try {
        useAuthStore.getState().cleanupAuthWatcher?.();
      } catch (_) {
        // ignore
      }
    };
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
 *
 * Fixes:
 * - Use react-router's useLocation instead of window to build redirect param safely.
 * - Avoid infinite "loading" screen by only gating when loading is true; otherwise decide based on isAuthenticated.
 */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <div className="text-muted">Checking authentication…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search || ""}`;
    const redirect = encodeURIComponent(redirectPath);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

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
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to get session", error);
        }

        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error initializing session", e);
        if (isMounted) setLoading(false);
      }
    }

    init();

    // Listen for further auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Supabase-backed auth methods

  // PUBLIC_INTERFACE
  async function signInWithPassword(email, password) {
    /**
     * Signs in a user with email and password.
     * Returns { data, error } from Supabase.
     */
    return supabase.auth.signInWithPassword({ email, password });
  }

  // PUBLIC_INTERFACE
  async function signUpWithPassword(email, password, emailRedirectTo) {
    /**
     * Signs up a user with email and password and sends a verification email.
     * emailRedirectTo should be SITE_URL/auth/reset-password or similar page.
     */
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    });
  }

  // PUBLIC_INTERFACE
  async function sendPasswordReset(email, redirectTo) {
    /**
     * Sends a password reset email.
     * redirectTo should be SITE_URL/auth/reset-password.
     */
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  }

  // PUBLIC_INTERFACE
  async function updatePassword(newPassword) {
    /**
     * Updates the user's password when on the reset-password page after being redirected from email link.
     */
    return supabase.auth.updateUser({ password: newPassword });
  }

  // PUBLIC_INTERFACE
  async function signOut() {
    /**
     * Signs out the current user.
     */
    const { error } = await supabase.auth.signOut();
    return { error };
  }

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

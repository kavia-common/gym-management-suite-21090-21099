import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { features } from '../../config/features';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards private routes when auth feature flag is ON.
 *
 * Behavior:
 * - When REACT_APP_FEATURE_AUTH is not enabled (default), this is a no-op and always renders children.
 * - When enabled, it checks for "authenticated" state using a lightweight heuristic:
 *     We use Supabase's getSession via a synchronous snapshot guard stored on window (optional),
 *     but to keep things simple and non-intrusive, this route expects that when auth is ON,
 *     a session indicator is placed on window.__gm_session or window.__gm_isAuthenticated by the app's auth bootstrap.
 *     If not present, it redirects to /auth/sign-in with a redirect param to the intended path.
 *
 * See docs/auth-behavior.md for context and how to wire up a full AuthProvider later.
 */
export default function ProtectedRoute() {
  // Always call hooks first to satisfy Rules of Hooks.
  const location = useLocation();

  // If auth feature is disabled, keep current behavior unchanged (no-op guard).
  if (!features.auth) {
    return <Outlet />;
  }

  // Minimal "real" guard when auth is enabled.
  const isAuthenticated = Boolean(
    (typeof window !== 'undefined' && (window.__gm_isAuthenticated || window.__gm_session)) || false
  );

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/sign-in?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}

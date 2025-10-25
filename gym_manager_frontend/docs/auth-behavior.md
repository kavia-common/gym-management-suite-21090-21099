# Auth Initialization and Protected Routing

This document explains how Supabase auth is initialized and how ProtectedRoute controls rendering.

Highlights:
- The Zustand `authStore` performs an initial `supabase.auth.getSession()` on mount via `initAuthWatcher()`, sets `user/session`, and clears `loading` to `false`.
- It registers an `onAuthStateChange` listener to sync auth state for sign-in, sign-out, and token refresh events.
- `AuthProvider` subscribes to the store, kicks off `initAuthWatcher`, and has a defensive `getSession` fallback after 500ms to ensure `loading` is cleared.
- `ProtectedRoute`:
  - Renders a small status while `loading` is `true`.
  - Redirects to `/auth/sign-in?redirect=<current>` when `loading` is `false` and the user is not authenticated.
  - Renders children when `loading` is `false` and a user is present.

Environment variables:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY`

If these are missing, the console will show an explicit error with guidance. Provide them via `.env` (see `.env.example`).

Topbar and App:
- Topbar consumes `useAuth()` only for sign-out and checks `loading` to avoid calling sign-out during transient states.
- App renders `AuthProvider` at the root to ensure all routes have access to auth state.

# Gym Manager Frontend

Stabilized bootstrap and routing.

Key changes:
- Top-level ErrorBoundary catches render/runtime errors with a retryable fallback.
- BootLoader validates env, initializes Supabase, resolves initial session, and then mounts the Router.
- ProtectedRoute uses a single derived auth state (initialized, authenticated).
- /health always renders "OK" to verify mount.
- /debug-auth shows loading -> authed/unauthed correctly.
- Global toast provider for notifications.
- React Router v7 future flags enabled to reduce deprecation noise.

Environment variables (set in .env):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Routes:
- Public: /health, /auth/*, /debug-auth
- Protected: /, /memberships, /classes, /trainers, /bookings, /settings, /portal/*

Bootstrap:
- index.js mounts ErrorBoundary -> ToastProvider -> BootLoader
- BootLoader handles env validation and initial session resolution
- RouterProvider is rendered only after initialization

# Auth Behavior (Feature-flagged Optional)

Authentication is disabled by default to improve preview stability, but can be enabled via a feature flag.

Default (auth OFF):
- ProtectedRoute renders children without redirects (no gating).
- Auth-related routes `/auth/*` are not mounted.
- The auth store is a no-op; `initialized=true`, `user/session=null`.
- useProfile returns a deterministic Guest profile.
- Supabase client remains for data access only; no auth listeners attached.

Optional (auth ON):
- Set `REACT_APP_FEATURE_AUTH=true` (at build time) to enable the auth pathway.
- ProtectedRoute enforces gating and redirects unauthenticated users to `/auth/sign-in?redirect=<intended>`.
- Auth pages are mounted: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`.
- useProfile fetches the current profile via `profilesApi.getCurrentProfile()`.

Notes:
- This step wires the routing and hook behavior only; it uses a minimal heuristic for "authenticated" state (window.__gm_isAuthenticated or __gm_session) until a full AuthProvider is reintroduced.
- For a complete auth experience, add an AuthProvider that mirrors Supabase auth events and sets the session marker expected by ProtectedRoute.

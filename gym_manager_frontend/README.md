# Gym Manager Frontend

This project is the frontend for the Gym Manager Application. It uses React and communicates with Supabase and backend services.

Auth Temporarily Disabled
- ProtectedRoute always renders children (no redirects).
- Routes do not include `/auth/*` pages in the app router.
- The auth store is a no-op; `initialized=true`, `session/user=null`.
- Supabase client remains for data access only; no auth listeners.
- Health route `/health` remains available.

## Environment Configuration

The app expects Supabase configuration through environment variables. Because this is a React app (Create React App), only variables prefixed with REACT_APP_ are exposed to the client bundle.

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Quick start:
1) Copy .env.example to .env
2) Fill in your Supabase values for REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY
3) Restart the dev server after any .env changes

Optional feature flags:
Feature flags can be toggled at build time using the pattern REACT_APP_FEATURE_<FLAGNAME>=true|false. Defaults are defined in src/config/features.js. Available flags include:
- REACT_APP_FEATURE_DASHBOARD
- REACT_APP_FEATURE_MEMBERSHIPS
- REACT_APP_FEATURE_CLASSES
- REACT_APP_FEATURE_TRAINERS
- REACT_APP_FEATURE_BOOKINGS
- REACT_APP_FEATURE_MEMBERPORTAL
- REACT_APP_FEATURE_TRAINERPORTAL

Note on preview/dev:
- After modifying .env, you must stop and restart the dev server for changes to take effect.
- If running via a remote preview, stop the preview process and relaunch to pick up new environment values.

## Scripts
- npm start
- npm test
- npm run build

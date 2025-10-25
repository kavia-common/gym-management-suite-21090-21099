# Gym Manager Frontend

This project is the frontend for the Gym Manager Application. It uses React and communicates with Supabase and backend services.

Auth Temporarily Disabled
- ProtectedRoute always renders children (no redirects).
- Routes do not include `/auth/*` pages in the app router.
- The auth store is a no-op; `initialized=true`, `session/user=null`.
- Supabase client remains for data access only; no auth listeners.
- Health route `/health` remains available.

Environment
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Scripts
- npm start
- npm test
- npm run build

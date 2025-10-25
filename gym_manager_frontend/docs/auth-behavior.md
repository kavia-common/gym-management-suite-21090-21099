# Auth Behavior (Temporarily Disabled)

Authentication is currently disabled to improve preview stability.

- ProtectedRoute now always renders its children without redirects.
- Auth-related routes `/auth/*` are not mounted in the main router.
- The auth store is a no-op and always reports `initialized=true` and `user/session=null`.
- Supabase client is configured for data access only; no auth listeners are attached.

To restore authentication, revert these changes to their earlier versions and reintroduce route gating and auth pages.

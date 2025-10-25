import create from 'zustand';

/**
 * PUBLIC_INTERFACE
 * No-op auth store for auth-disabled mode.
 * - initialized is always true
 * - session/user/profile are null
 * - setters are no-ops to preserve interface compatibility
 */
export const useAuthStore = create((_set) => ({
  initialized: true,
  session: null,
  user: null,
  profile: null,
  role: null,

  // PUBLIC_INTERFACE
  setSession: () => {},
  // PUBLIC_INTERFACE
  setInitialized: () => {},
}));

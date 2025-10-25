import create from 'zustand';

/**
 * Auth store maintains the minimal derived state required for routing:
 * - session: the Supabase session object, or null
 * - initialized: whether bootstrap has completed the initial session check
 */
// PUBLIC_INTERFACE
export const useAuthStore = create((set) => ({
  session: null,
  initialized: false,
  // PUBLIC_INTERFACE
  setSession: (session) => set({ session }),
  // PUBLIC_INTERFACE
  setInitialized: (initialized) => set({ initialized }),
}));

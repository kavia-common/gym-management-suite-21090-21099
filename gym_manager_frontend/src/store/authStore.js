import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Auth store centralizes user, session, and profile state mirrored from Supabase.
 * It subscribes to Supabase auth changes. Other parts of the app can select needed slices.
 */
export const useAuthStore = create((set, get) => {
  // Internal helper to fetch minimal profile if your DB has a "profiles" table.
  // This is a scaffold; safe to leave as no-op if table not present yet.
  async function fetchProfile(userId) {
    try {
      if (!userId) return null;
      // Placeholder: you can wire to your "profiles" table later.
      // Example:
      // const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      // if (error) throw error;
      // return data;
      return null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Profile fetch skipped or failed:", err?.message);
      return null;
    }
  }

  // Initialize auth subscription once per store instance
  let subscribed = false;
  const ensureSubscribed = () => {
    if (subscribed) return;
    subscribed = true;

    // Initial session load
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Auth getSession error:", error);
      }
      const session = data?.session ?? null;
      const user = session?.user ?? null;
      const profile = user ? await fetchProfile(user.id) : null;
      set({ session, user, profile, isAuthenticated: !!user, loading: false });
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const user = newSession?.user ?? null;
      const profile = user ? await fetchProfile(user.id) : null;
      set({ session: newSession, user, profile, isAuthenticated: !!user, loading: false });
    });

    // Store unsubscribe to allow explicit cleanup if ever needed
    set({ _unsubscribe: () => listener.subscription?.unsubscribe?.() });
  };

  // Exposed auth actions backed by Supabase
  return {
    // State
    session: null,
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true,
    _unsubscribe: null,

    // PUBLIC_INTERFACE
    initAuthWatcher: () => {
      /** Starts the Supabase auth watcher and initializes the store with current session/user. */
      ensureSubscribed();
    },

    // PUBLIC_INTERFACE
    signInWithPassword: async (email, password) => {
      /** Sign in with email/password via Supabase and let the listener update state. */
      return supabase.auth.signInWithPassword({ email, password });
    },

    // PUBLIC_INTERFACE
    signUpWithPassword: async (email, password, emailRedirectTo) => {
      /** Sign up with email/password via Supabase; sends verification email. */
      return supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
        },
      });
    },

    // PUBLIC_INTERFACE
    sendPasswordReset: async (email, redirectTo) => {
      /** Send password reset email via Supabase. */
      return supabase.auth.resetPasswordForEmail(email, { redirectTo });
    },

    // PUBLIC_INTERFACE
    updatePassword: async (newPassword) => {
      /** Update current user's password via Supabase. */
      return supabase.auth.updateUser({ password: newPassword });
    },

    // PUBLIC_INTERFACE
    signOut: async () => {
      /** Sign out current user via Supabase. */
      const { error } = await supabase.auth.signOut();
      if (!error) {
        set({ session: null, user: null, profile: null, isAuthenticated: false });
      }
      return { error };
    },
  };
});

/**
 * PUBLIC_INTERFACE
 * getAuthState selector returning current auth state at call time.
 */
export function getAuthState() {
  /** Returns current snapshot of auth state. */
  const { user, session, profile, isAuthenticated, loading } = useAuthStore.getState();
  return { user, session, profile, isAuthenticated, loading };
}

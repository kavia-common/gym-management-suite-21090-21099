import { create } from "zustand";
import { getSupabase } from "../lib/supabaseClient";

/* eslint-disable no-console */
const supabase = getSupabase();

// Ensure only a single subscription across hot-reloads/environments
let moduleSubscribed = false;
let moduleUnsubscribe = null;

/**
 * PUBLIC_INTERFACE
 * Auth store centralizes user, session, and profile state mirrored from Supabase.
 * It subscribes to Supabase auth changes. Other parts of the app can select needed slices.
 */
export const useAuthStore = create((set, get) => {
  async function fetchProfile(userId) {
    try {
      if (!userId) return null;
      // Placeholder for future profile fetch from DB.
      return null;
    } catch (err) {
      console.warn("Profile fetch skipped or failed:", err?.message);
      return null;
    }
  }

  async function resolveInitialSessionWithTimeout(ms = 5000) {
    // Race getSession against timeout to avoid infinite loading in network stalls
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve({ data: { session: null }, error: new Error("getSession timeout") }), ms)
    );
    try {
      const result = await Promise.race([supabase.auth.getSession(), timeout]);
      return result;
    } catch (e) {
      return { data: { session: null }, error: e };
    }
  }

  const ensureSubscribed = () => {
    if (moduleSubscribed) {
      // Keep store in sync with any late subscribers
      set((s) => ({ ...s }));
      return;
    }
    moduleSubscribed = true;
    set({ loading: true });

    // Initial session resolution with timeout safeguard
    resolveInitialSessionWithTimeout()
      .then(async ({ data, error }) => {
        if (error) {
          console.warn("Auth getSession issue:", error?.message || error);
        }
        const session = data?.session ?? null;
        const user = session?.user ?? null;
        const profile = user ? await fetchProfile(user.id) : null;
        set({ session, user, profile, isAuthenticated: !!user, loading: false });
      })
      .catch((e) => {
        console.error("Auth getSession exception:", e?.message || e);
        set({ session: null, user: null, profile: null, isAuthenticated: false, loading: false });
      });

    // onAuthStateChange listener
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.info("[Auth] onAuthStateChange:", event);
      const user = newSession?.user ?? null;
      const profile = user ? await fetchProfile(user.id) : null;
      set({ session: newSession, user, profile, isAuthenticated: !!user, loading: false, _lastEvent: event });
    });

    moduleUnsubscribe = () => listener.subscription?.unsubscribe?.();
    set({ _unsubscribe: moduleUnsubscribe });
  };

  return {
    // State
    session: null,
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: true, // also used as "isInitializing" during INITIAL_SESSION
    _unsubscribe: null,
    _lastEvent: null,

    // PUBLIC_INTERFACE
    initAuthWatcher: () => {
      /** Starts the Supabase auth watcher and initializes the store with current session/user. */
      ensureSubscribed();
    },

    // PUBLIC_INTERFACE
    cleanupAuthWatcher: () => {
      /** Unsubscribe Supabase auth listener if initialized. */
      try {
        moduleUnsubscribe?.();
      } catch (_) {}
      moduleUnsubscribe = null;
      moduleSubscribed = false;
      set({ _unsubscribe: null });
    },

    // PUBLIC_INTERFACE
    signInWithPassword: async (email, password) => {
      /** Sign in with email/password via Supabase and let the listener update state. */
      try {
        return await supabase.auth.signInWithPassword({ email, password });
      } catch (e) {
        console.error("signInWithPassword error:", e?.message || e);
        return { data: null, error: e };
      }
    },

    // PUBLIC_INTERFACE
    signUpWithPassword: async (email, password, emailRedirectTo) => {
      /** Sign up with email/password via Supabase; sends verification email. */
      try {
        return await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
      } catch (e) {
        console.error("signUpWithPassword error:", e?.message || e);
        return { data: null, error: e };
      }
    },

    // PUBLIC_INTERFACE
    sendPasswordReset: async (email, redirectTo) => {
      /** Send password reset email via Supabase. */
      try {
        return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      } catch (e) {
        console.error("sendPasswordReset error:", e?.message || e);
        return { data: null, error: e };
      }
    },

    // PUBLIC_INTERFACE
    updatePassword: async (newPassword) => {
      /** Update current user's password via Supabase. */
      try {
        return await supabase.auth.updateUser({ password: newPassword });
      } catch (e) {
        console.error("updatePassword error:", e?.message || e);
        return { data: null, error: e };
      }
    },

    // PUBLIC_INTERFACE
    signOut: async () => {
      /** Sign out current user via Supabase. */
      try {
        const { error } = await supabase.auth.signOut();
        if (!error) {
          set({ session: null, user: null, profile: null, isAuthenticated: false, loading: false, _lastEvent: "SIGNED_OUT" });
        }
        return { error };
      } catch (e) {
        console.error("signOut error:", e?.message || e);
        return { error: e };
      }
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

/**
 * PUBLIC_INTERFACE
 * isInitializing returns whether the auth store is still resolving the initial session.
 */
export function isInitializing() {
  const { loading } = useAuthStore.getState();
  return !!loading;
}

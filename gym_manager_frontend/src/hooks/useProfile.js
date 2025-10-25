import { useEffect, useMemo, useState } from 'react';
import { features } from '../config/features';
import { profilesApi } from '../data/profilesApi';

/**
 * PUBLIC_INTERFACE
 * useProfile returns a stable object: { data, loading, error }.
 *
 * - When auth feature flag is OFF (default), it returns a deterministic "Guest" profile.
 * - When auth feature flag is ON, it fetches the real profile via profilesApi.
 *
 * See docs/auth-behavior.md for behavior and how to enable auth using REACT_APP_FEATURE_AUTH=true.
 */
export function useProfile() {
  // Guest fallback shape (used when auth disabled or when auth fetch fails)
  const guest = useMemo(() => ({
    id: null,
    full_name: 'Guest',
    email: '',
    role: 'member',
    plan_name: 'Standard',
    membership_status: 'active',
    renews_at: null,
  }), []);

  // Local state for the "auth ON" pathway
  const [authState, setAuthState] = useState({ data: null, loading: true, error: null });

  // When auth is enabled, attempt to load the current profile.
  useEffect(() => {
    if (!features.auth) {
      // When auth is OFF, do not perform any async work.
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await profilesApi.getCurrentProfile();
        if (!mounted) return;
        if (error) {
          setAuthState({ data: null, loading: false, error });
        } else {
          setAuthState({ data: data || null, loading: false, error: null });
        }
      } catch (e) {
        if (!mounted) return;
        setAuthState({ data: null, loading: false, error: e });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Compose the return value based on the feature flag.
  if (!features.auth) {
    return { data: guest, loading: false, error: null };
  }
  return authState;
}

// Default export kept for backward compatibility in case of default imports elsewhere.
// PUBLIC_INTERFACE
export default useProfile;

import { useEffect } from 'react';
import { useMembershipsStore } from '../store/membershipsStore';

/**
 * PUBLIC_INTERFACE
 * Profile hook adjusted for auth-disabled mode.
 * Without a user id, no profile is loaded; returns null safely.
 */
export function useProfile() {
  const { loadProfile, profile } = useMembershipsStore();

  useEffect(() => {
    // auth disabled: do not auto-load a profile
  }, [loadProfile]);

  return profile ?? null;
}

// Default export kept for backward compatibility in case of default imports elsewhere.
export default useProfile;

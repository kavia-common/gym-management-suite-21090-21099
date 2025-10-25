import { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * useProfile returns a stable non-null object: { data, loading, error }.
 * In auth-disabled mode, we provide a minimal "Guest" fallback with role 'member'.
 * This prevents destructuring crashes when consumers expect an object.
 */
export function useProfile() {
  // Since auth is disabled, we expose a default guest-like profile.
  const value = useMemo(() => {
    const guest = {
      id: null,
      full_name: 'Guest',
      email: '',
      role: 'member',
      plan_name: 'Standard',
      membership_status: 'active',
      renews_at: null,
    };
    return { data: guest, loading: false, error: null };
  }, []);

  return value;
}

// Default export kept for backward compatibility in case of default imports elsewhere.
// PUBLIC_INTERFACE
export default useProfile;

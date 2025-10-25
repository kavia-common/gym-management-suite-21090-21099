import React, { useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '../routes';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/common/Loader';

/**
 * BootLoader centralizes app bootstrap:
 * - Validates required env vars (REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)
 * - Ensures Supabase client exists
 * - Resolves initial auth session and initializes auth store
 * - Only after initialization renders the Router
 */

// PUBLIC_INTERFACE
export default function BootLoader() {
  const [initState, setInitState] = useState({ initialized: false, error: null });

  const setAuthInitialized = useAuthStore((s) => s.setInitialized);
  const setSession = useAuthStore((s) => s.setSession);

  // Validate environment strictly via REACT_APP_ vars
  const envValidation = useMemo(() => {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_KEY;
    const errors = [];
    if (!url) errors.push('Missing REACT_APP_SUPABASE_URL');
    if (!key) errors.push('Missing REACT_APP_SUPABASE_KEY');
    return { valid: errors.length === 0, errors };
  }, []);

  // Create router once; using routes export with future flags configured in index.js
  const router = useMemo(() => createBrowserRouter(routes), []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      // Guard against missing env
      if (!envValidation.valid) {
        if (isMounted) {
          setInitState({ initialized: false, error: new Error(envValidation.errors.join(', ')) });
          setAuthInitialized(false);
        }
        return;
      }

      try {
        // Resolve initial session using Supabase
        const { data, error } = await supabase.auth.getSession();
        if (error && process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[BootLoader] getSession error suppressed:', error.message);
        }
        if (!isMounted) return;

        const session = data?.session ?? null;
        setSession(session);
        setAuthInitialized(true);

        setInitState({ initialized: true, error: null });
      } catch (err) {
        if (!isMounted) return;
        // Guard against extension-related errors
        const safeError = err instanceof Error ? err : new Error('Unknown bootstrap error');
        setInitState({ initialized: false, error: safeError });
        setAuthInitialized(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [envValidation, setAuthInitialized, setSession]);

  // Render branches determined after all hooks are declared
  const renderLoading = (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Loader text="Loading application..." />
    </div>
  );

  const renderConfigError = (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div>
        <h2 style={{ marginBottom: 8 }}>Configuration error</h2>
        <p style={{ color: '#6b7280' }}>
          {initState.error?.message}
        </p>
        <p style={{ marginTop: 8, color: '#6b7280' }}>
          Ensure .env contains REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
        </p>
      </div>
    </div>
  );

  if (!initState.initialized && !initState.error) return renderLoading;
  if (initState.error) return renderConfigError;

  return <RouterProvider router={router} fallbackElement={<Loader text="Routing..." />} />;
}

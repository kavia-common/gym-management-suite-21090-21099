import React from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * /debug-auth provides minimal, clear auth diagnostics:
 * - loading -> authed/unauthed accurately based on derived state
 */
// PUBLIC_INTERFACE
export default function DebugAuth() {
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const authenticated = Boolean(session);

  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 8, fontSize: 18 }}>Auth Diagnostics</h1>
      {!initialized && <p style={{ color: '#6b7280' }}>status: loading</p>}
      {initialized && authenticated && (
        <>
          <p style={{ color: '#10b981' }}>status: authenticated</p>
          <pre style={{ background: '#f3f4f6', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(
              {
                userId: session?.user?.id || null,
                email: session?.user?.email || null,
                expiresAt: session?.expires_at || null,
              },
              null,
              2
            )}
          </pre>
        </>
      )}
      {initialized && !authenticated && (
        <p style={{ color: '#ef4444' }}>status: unauthenticated</p>
      )}
    </div>
  );
}

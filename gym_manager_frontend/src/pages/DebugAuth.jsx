import React from "react";
import { getSupabase } from "../lib/supabaseClient";
import { useAuthStore } from "../store/authStore";

// PUBLIC_INTERFACE
export default function DebugAuth() {
  /** Debug page to display env detection, session, loading, and last auth event */
  const supabase = getSupabase();
  const { session, user, loading } = useAuthStore((s) => ({ session: s.session, user: s.user, loading: s.loading }));
  const lastEvent = useAuthStore((s) => s._lastEvent);

  const envInfo = {
    REACT_APP_SUPABASE_URL_present: !!process.env.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY_present: !!process.env.REACT_APP_SUPABASE_KEY,
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>Debug Auth</h2>

      <section style={{ marginTop: 12 }}>
        <h4>Environment</h4>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
          {JSON.stringify(envInfo, null, 2)}
        </pre>
        {!envInfo.REACT_APP_SUPABASE_URL_present || !envInfo.REACT_APP_SUPABASE_KEY_present ? (
          <div style={{ color: "#b45309", marginTop: 8 }}>
            Missing env vars. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set and restart the dev server.
          </div>
        ) : null}
      </section>

      <section style={{ marginTop: 12 }}>
        <h4>Auth State</h4>
        {loading ? (
          <div style={{ color: "#6b7280" }}>Loading initial session…</div>
        ) : user ? (
          <div>
            <div style={{ color: "#065f46" }}>Authenticated</div>
            <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
              {JSON.stringify(
                {
                  userId: user?.id || null,
                  email: user?.email || null,
                  sessionPresent: !!session,
                  lastEvent,
                },
                null,
                2
              )}
            </pre>
          </div>
        ) : (
          <div style={{ color: "#991b1b" }}>Not authenticated</div>
        )}
      </section>

      <div style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
        Supabase client initialized: {supabase ? "yes" : "no"}
      </div>
    </div>
  );
}

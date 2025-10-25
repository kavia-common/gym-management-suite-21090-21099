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
      <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(
          {
            envInfo,
            lastEvent,
            loading,
            sessionPresent: !!session,
            userPresent: !!user,
            userId: user?.id || null,
          },
          null,
          2
        )}
      </pre>
      <div style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
        Supabase client initialized: {supabase ? "yes" : "no"}
      </div>
    </div>
  );
}

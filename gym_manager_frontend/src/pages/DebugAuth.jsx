import React from 'react';

/**
 * DebugAuth retained for reference but not routed while auth is disabled.
 */
export default function DebugAuth() {
  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 8, fontSize: 18 }}>Auth Diagnostics</h1>
      <p>Authentication is currently disabled in this preview.</p>
    </div>
  );
}

import React from 'react';
import Button from '../common/Button';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../common/ToastProvider';

/**
 * PUBLIC_INTERFACE
 * Topbar with search, notifications and user menu placeholder.
 */
export default function Topbar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const initialized = useAuthStore((s) => s.initialized);
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const { showToast } = useToast();

  const isAuthenticated = Boolean(session);
  const loading = !initialized;

  async function handleSignOut() {
    if (loading) return; // avoid sign-out during transient loading states
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(error.message || 'Failed to sign out', 'error');
      return;
    }
    // Ensure store reflects sign-out immediately
    setSession(null);
    showToast('Signed out', 'info');
  }

  return (
    <header
      className="app-gradient"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)', // ensure solid background over gradient on scroll
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 0',
        }}
      >
        <div className="hide-mobile" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Dashboard
        </div>
        <Button variant="ghost" ariaLabel="Toggle navigation" onClick={toggleSidebar}>
          ☰
        </Button>
        <div style={{ flex: 1 }}>
          <input className="input-base" placeholder="Search members, classes, trainers..." aria-label="Search" />
        </div>
        <Button variant="ghost" ariaLabel="Notifications">🔔</Button>
        {isAuthenticated && (
          <Button variant="ghost" ariaLabel="Sign out" onClick={handleSignOut}>
            ⎋ Sign out
          </Button>
        )}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            border: '1px solid var(--color-border)',
            borderRadius: '999px',
            background: 'var(--color-surface)',
          }}
          role="button"
          aria-label="User menu"
        >
          <span role="img" aria-label="user">🧑</span>
          <span className="hide-mobile">Admin</span>
        </div>
      </div>
    </header>
  );
}

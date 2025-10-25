import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

/**
 * PUBLIC_INTERFACE
 * RoleRedirect simplified: with auth disabled, route to home by default.
 */
export default function RoleRedirect() {
  const navigate = useNavigate();
  // Access profile via hook (stable shape); not used for redirect.
  // eslint-disable-next-line no-unused-vars
  const { data: _profile } = useProfile();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="container" style={{ padding: 24 }}>
      <div className="text-muted">Redirecting…</div>
    </div>
  );
}

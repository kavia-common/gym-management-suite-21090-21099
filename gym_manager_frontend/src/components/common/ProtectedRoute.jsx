import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * No-op ProtectedRoute that always renders children.
 * Auth is disabled for preview: no redirects, no gating.
 */
export default function ProtectedRoute() {
  return <Outlet />;
}

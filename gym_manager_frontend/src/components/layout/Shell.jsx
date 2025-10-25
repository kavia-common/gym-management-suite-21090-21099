import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

/**
 * Shell is the main layout wrapper for protected routes.
 * Contains sidebar, topbar, and renders nested route content via Outlet.
 */
// PUBLIC_INTERFACE
export default function Shell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Topbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

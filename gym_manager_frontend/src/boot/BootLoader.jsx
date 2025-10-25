import React, { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '../routes';
import Loader from '../components/common/Loader';

/**
 * BootLoader simplified for auth-disabled mode.
 * Creates a single BrowserRouter instance and mounts one RouterProvider.
 * No auth initialization is performed here.
 */
export default function BootLoader() {
  // Development guard to surface accidental multiple mounts during hot reloads
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-underscore-dangle
    window.__gm_router_mounts = (window.__gm_router_mounts || 0) + 1;
    if (window.__gm_router_mounts > 1) {
      // eslint-disable-next-line no-console
      console.warn('[BootLoader] Ensure only one <RouterProvider /> is mounted (multiple mounts detected in dev).');
    }
  }

  // Stable router instance
  const router = useMemo(() => createBrowserRouter(routes), []);

  // Mount a single RouterProvider with a minimal fallback
  return <RouterProvider router={router} fallbackElement={<Loader label="Routing..." />} />;
}

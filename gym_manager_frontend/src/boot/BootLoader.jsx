import React, { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '../routes';
import Loader from '../components/common/Loader';

/**
 * BootLoader simplified for auth-disabled mode.
 * Immediately mounts the RouterProvider; no auth initialization.
 */
export default function BootLoader() {
  const router = useMemo(() => createBrowserRouter(routes), []);
  return <RouterProvider router={router} fallbackElement={<Loader text="Routing..." />} />;
}

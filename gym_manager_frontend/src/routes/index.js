import React from 'react';
import Shell from '../components/layout/Shell';
import Dashboard from '../pages/Dashboard';
import Memberships from '../pages/Memberships';
import Classes from '../pages/Classes';
import Trainers from '../pages/Trainers';
import Bookings from '../pages/Bookings';
import Settings from '../pages/Settings';
import RoleRedirect from '../pages/portals/RoleRedirect';
import MemberPortal from '../pages/portals/MemberPortal';
import TrainerPortal from '../pages/portals/TrainerPortal';
import Health from '../pages/Health';

// Optional auth pages (only mounted when auth feature is enabled)
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import ProtectedRoute from '../components/common/ProtectedRoute';
import { features } from '../config/features';

/**
 * PUBLIC_INTERFACE
 * Export route objects for use with createBrowserRouter/createMemoryRouter.
 * All routes define explicit, globally unique "id" fields to avoid collisions.
 *
 * Auth feature flag:
 * - When REACT_APP_FEATURE_AUTH=true, /auth/* routes are mounted and protected routes are wrapped with <ProtectedRoute />.
 * - When OFF (default), /auth/* routes are omitted and protected sections are effectively public (no-op guard).
 * See docs/auth-behavior.md for details.
 */
const authRoutes = features.auth
  ? [
      { id: 'route-auth-signin', path: 'auth/sign-in', element: <SignIn /> },
      { id: 'route-auth-signup', path: 'auth/sign-up', element: <SignUp /> },
      { id: 'route-auth-forgot', path: 'auth/forgot-password', element: <ForgotPassword /> },
      { id: 'route-auth-reset', path: 'auth/reset-password', element: <ResetPassword /> },
    ]
  : [];

const protectedShellRoute = features.auth
  ? {
      id: 'route-shell',
      element: <ProtectedRoute />, // Guarded entry when auth is enabled
      children: [
        { id: 'route-shell-layout', element: <Shell />, children: [
          { id: 'route-dashboard', index: true, element: <Dashboard /> },
          { id: 'route-memberships', path: 'memberships', element: <Memberships /> },
          { id: 'route-classes', path: 'classes', element: <Classes /> },
          { id: 'route-trainers', path: 'trainers', element: <Trainers /> },
          { id: 'route-bookings', path: 'bookings', element: <Bookings /> },
          { id: 'route-settings', path: 'settings', element: <Settings /> },
          // Portals
          { id: 'route-portal-redirect', path: 'portal', element: <RoleRedirect /> },
          { id: 'route-portal-member', path: 'portal/member', element: <MemberPortal /> },
          { id: 'route-portal-trainer', path: 'portal/trainer', element: <TrainerPortal /> },
        ] },
      ],
    }
  : {
      // Default behavior unchanged: direct Shell with no guard
      id: 'route-shell',
      element: <Shell />,
      children: [
        { id: 'route-dashboard', index: true, element: <Dashboard /> },
        { id: 'route-memberships', path: 'memberships', element: <Memberships /> },
        { id: 'route-classes', path: 'classes', element: <Classes /> },
        { id: 'route-trainers', path: 'trainers', element: <Trainers /> },
        { id: 'route-bookings', path: 'bookings', element: <Bookings /> },
        { id: 'route-settings', path: 'settings', element: <Settings /> },
        // Portals
        { id: 'route-portal-redirect', path: 'portal', element: <RoleRedirect /> },
        { id: 'route-portal-member', path: 'portal/member', element: <MemberPortal /> },
        { id: 'route-portal-trainer', path: 'portal/trainer', element: <TrainerPortal /> },
      ],
    };

const routes = [
  {
    id: 'route-root',
    path: '/',
    children: [
      // Public health route at /health
      {
        id: 'route-health',
        path: 'health',
        element: <Health />,
      },
      // Conditionally include auth routes
      ...authRoutes,
      // Protected or unprotected shell depending on feature flag
      protectedShellRoute,
    ],
  },
];

export default routes;

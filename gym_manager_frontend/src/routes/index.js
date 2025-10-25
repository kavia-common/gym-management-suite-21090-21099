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

/**
 * PUBLIC_INTERFACE
 * Export route objects for use with createBrowserRouter/createMemoryRouter.
 * All routes define explicit, globally unique "id" fields to avoid collisions.
 */
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
      // Application shell with nested module routes
      {
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
      },
    ],
  },
];

export default routes;

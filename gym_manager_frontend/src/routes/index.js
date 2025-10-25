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

/**
 * Minimal health-check element that always renders "OK".
 */
function Health() {
  return <div style={{ padding: 16, fontFamily: 'sans-serif' }}>OK</div>;
}

/**
 * PUBLIC_INTERFACE
 * Export route objects for use with createBrowserRouter/createMemoryRouter.
 * All routes define explicit, globally unique "id" fields to avoid collisions.
 */
const routes = [
  {
    id: 'root',
    path: '/',
    // Note: Children include a Shell layout branch and a public health route.
    children: [
      {
        id: 'health',
        path: 'health',
        element: <Health />,
      },
      {
        id: 'app-shell',
        element: <Shell />,
        children: [
          { id: 'dashboard', index: true, element: <Dashboard /> },
          { id: 'memberships', path: 'memberships', element: <Memberships /> },
          { id: 'classes', path: 'classes', element: <Classes /> },
          { id: 'trainers', path: 'trainers', element: <Trainers /> },
          { id: 'bookings', path: 'bookings', element: <Bookings /> },
          { id: 'settings', path: 'settings', element: <Settings /> },
          // Portals
          { id: 'portal-redirect', path: 'portal', element: <RoleRedirect /> },
          { id: 'portal-member', path: 'portal/member', element: <MemberPortal /> },
          { id: 'portal-trainer', path: 'portal/trainer', element: <TrainerPortal /> },
        ],
      },
    ],
  },
];

export default routes;

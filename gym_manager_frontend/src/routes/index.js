import React from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
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

// Minimal health-check element that always renders "OK"
function Health() {
  return <div style={{ padding: 16, fontFamily: 'sans-serif' }}>OK</div>;
}

// Create route objects for RouterProvider
const routerElements = createRoutesFromElements(
  <Route path="/">
    {/* Public health check */}
    <Route path="health" element={<Health />} />

    {/* Application routes (no auth gating) */}
    <Route element={<Shell />}>
      <Route index element={<Dashboard />} />
      <Route path="memberships" element={<Memberships />} />
      <Route path="classes" element={<Classes />} />
      <Route path="trainers" element={<Trainers />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="settings" element={<Settings />} />

      {/* Portals */}
      <Route path="portal" element={<RoleRedirect />} />
      <Route path="portal/member" element={<MemberPortal />} />
      <Route path="portal/trainer" element={<TrainerPortal />} />
    </Route>
  </Route>
);

// PUBLIC_INTERFACE
const routes = [
  {
    path: '/',
    children: routerElements,
  },
];

export default routes;

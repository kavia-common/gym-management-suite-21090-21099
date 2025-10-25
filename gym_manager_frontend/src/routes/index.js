import React from 'react';
import { createRoutesFromElements, Route } from 'react-router-dom';
import Shell from '../components/layout/Shell';
import Dashboard from '../pages/Dashboard';
import Memberships from '../pages/Memberships';
import Classes from '../pages/Classes';
import Trainers from '../pages/Trainers';
import Bookings from '../pages/Bookings';
import Settings from '../pages/Settings';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DebugAuth from '../pages/DebugAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleRedirect from '../pages/portals/RoleRedirect';
import MemberPortal from '../pages/portals/MemberPortal';
import TrainerPortal from '../pages/portals/TrainerPortal';

// Minimal health-check element that always renders "OK"
function Health() {
  return (
    <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
      OK
    </div>
  );
}

// Create route objects with React Router v7 future flags enabled via index.js boot
const routerElements = createRoutesFromElements(
  <Route path="/">
    {/* Public health check, must always render regardless of auth */}
    <Route path="health" element={<Health />} />

    {/* Public auth routes */}
    <Route path="auth">
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Route>

    {/* Debug auth diagnostics, minimal and clear */}
    <Route path="debug-auth" element={<DebugAuth />} />

    {/* Protected application routes */}
    <Route element={<ProtectedRoute />}>
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

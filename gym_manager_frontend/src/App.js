import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './routes';
import './store/authStore'; // ensure store module is evaluated early

import Dashboard from './pages/Dashboard';
import Memberships from './pages/Memberships';
import Classes from './pages/Classes';
import Trainers from './pages/Trainers';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import MemberPortal from './pages/portals/MemberPortal';
import TrainerPortal from './pages/portals/TrainerPortal';
import RoleRedirect from './pages/portals/RoleRedirect';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DebugAuth from './pages/DebugAuth';

// PUBLIC_INTERFACE
function App() {
  /** Root of the app rendering the Router with protected routes and auth routes. */
  return (
    <div className="app-root">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/memberships" element={<Memberships />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/portal/member" element={<MemberPortal />} />
              <Route path="/portal/trainer" element={<TrainerPortal />} />
              <Route path="/portal" element={<RoleRedirect />} />
            </Route>

            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/debug-auth" element={<DebugAuth />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;

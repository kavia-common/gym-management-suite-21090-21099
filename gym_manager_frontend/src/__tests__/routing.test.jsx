import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../routes';
import { ProtectedRoute } from '../routes';

function PrivatePage() {
  return <div>Private Content</div>;
}

function SignInPage() {
  return <div>Sign In Page</div>;
}

test('ProtectedRoute redirects unauthenticated users to /auth/sign-in with redirect param', () => {
  const auth = {
    user: null,
    session: null,
    isAuthenticated: false,
    loading: false,
    signInWithPassword: jest.fn(),
    signUpWithPassword: jest.fn(),
    sendPasswordReset: jest.fn(),
    updatePassword: jest.fn(),
    signOut: jest.fn(),
  };

  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/memberships']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/memberships" element={<PrivatePage />} />
          </Route>
          <Route path="/auth/sign-in" element={<SignInPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // Expect the sign-in page to be shown, not the private content
  expect(screen.getByText(/Sign In Page/i)).toBeInTheDocument();
  expect(screen.queryByText(/Private Content/i)).not.toBeInTheDocument();
});

test('ProtectedRoute renders children when authenticated', () => {
  const auth = {
    user: { id: 'u1' },
    session: { user: { id: 'u1' } },
    isAuthenticated: true,
    loading: false,
    signInWithPassword: jest.fn(),
    signUpWithPassword: jest.fn(),
    sendPasswordReset: jest.fn(),
    updatePassword: jest.fn(),
    signOut: jest.fn(),
  };

  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/memberships']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/memberships" element={<PrivatePage />} />
          </Route>
          <Route path="/auth/sign-in" element={<SignInPage />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // Private content should be visible for authenticated users
  expect(screen.getByText(/Private Content/i)).toBeInTheDocument();
  expect(screen.queryByText(/Sign In Page/i)).not.toBeInTheDocument();
});

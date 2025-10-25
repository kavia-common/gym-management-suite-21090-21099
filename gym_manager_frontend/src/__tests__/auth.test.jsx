import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../routes';
import SignIn from '../pages/auth/SignIn';

function Target() {
  return <div>Redirect Target</div>;
}

test('SignIn navigates to redirect param after successful sign-in', async () => {
  const signInWithPassword = jest.fn().mockResolvedValue({ data: {}, error: null });

  const auth = {
    user: null,
    session: null,
    isAuthenticated: false,
    loading: false,
    signInWithPassword,
    signUpWithPassword: jest.fn(),
    sendPasswordReset: jest.fn(),
    updatePassword: jest.fn(),
    signOut: jest.fn(),
  };

  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={['/auth/sign-in?redirect=/portal/member']}>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/portal/member" element={<Target />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  // Fill in form
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

  await waitFor(() => {
    expect(signInWithPassword).toHaveBeenCalledWith('test@example.com', 'secret');
  });

  // After sign-in, the redirect target should render
  await waitFor(() => {
    expect(screen.getByText(/Redirect Target/i)).toBeInTheDocument();
  });
});

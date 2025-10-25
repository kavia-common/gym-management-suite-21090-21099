import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../routes';

/**
 * PUBLIC_INTERFACE
 * renderWithProviders wraps children with AuthProvider and MemoryRouter
 * to support routing and auth context during tests.
 */
export function renderWithProviders(ui, { route = '/', initialEntries, ...options } = {}) {
  const Wrapper = ({ children }) => (
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries || [route]}>
        {children}
      </MemoryRouter>
    </AuthProvider>
  );
  return { Wrapper, options };
}

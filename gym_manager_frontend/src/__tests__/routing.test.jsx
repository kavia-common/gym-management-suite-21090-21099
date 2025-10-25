import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import routes from '../routes';

test('renders dashboard without authentication', async () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  });

  render(<RouterProvider router={router} />);
  // Dashboard component should render something identifiable by "Dashboard" heading/text
  const dashboardText = await screen.findByText(/dashboard/i);
  expect(dashboardText).toBeInTheDocument();
});

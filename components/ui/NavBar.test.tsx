import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));
vi.mock('./LogOutButton', () => ({ default: () => <button>MockSignOut</button> }));

import NavBar from './NavBar';

test('renders Dashboard link and LogOutButton, marks active when on /dashboard', () => {
  render(<NavBar />);

  const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
  expect(dashboardLink).toBeInTheDocument();
  expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  expect(dashboardLink).toHaveAttribute('aria-current', 'page');

  const logout = screen.getByRole('button', { name: /mocksignout/i });
  expect(logout).toBeInTheDocument();
});

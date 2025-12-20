import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
});

test('hides nav on root path', async () => {
  vi.doMock('next/navigation', () => ({ usePathname: () => '/' }));
  vi.doMock('./NavBar', () => ({ default: () => <nav data-testid="nav">nav</nav> }));
  const { default: NavHost } = await import('./NavHost');
  render(<NavHost />);
  expect(screen.queryByTestId('nav')).toBeNull();
});

test('shows nav on /dashboard', async () => {
  vi.doMock('next/navigation', () => ({ usePathname: () => '/dashboard' }));
  vi.doMock('./NavBar', () => ({ default: () => <nav data-testid="nav">nav</nav> }));
  const { default: NavHost } = await import('./NavHost');
  render(<NavHost />);
  expect(screen.getByTestId('nav')).toBeInTheDocument();
});

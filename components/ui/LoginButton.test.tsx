import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginButton from './LoginButton';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: () => ({ data: null, status: 'loading' }),
}));

test('renders loading state', () => {
  render(<LoginButton />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LogOutButton from './LogOutButton';

// Mock next-auth signOut
const signOutMock = vi.fn();
vi.mock('next-auth/react', () => ({
  // use `unknown[]` instead of `any[]` to satisfy linting rules
  signOut: (...args: unknown[]) => signOutMock(...(args as unknown[])),
}));

describe('LogOutButton', () => {
  beforeEach(() => {
    signOutMock.mockClear();
  });

  it('renders with default label', () => {
    render(<LogOutButton />);
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('calls signOut with callbackUrl on click', () => {
    render(<LogOutButton />);
    const btn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(btn);
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/' });
  });

  it('prevents multiple signOut calls when clicked repeatedly and disables the button', () => {
    render(<LogOutButton />);
    const btn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(btn);
    // subsequent clicks should be ignored
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(btn).toBeDisabled();
  });

  it('applies style prop to the button', () => {
    render(<LogOutButton style={{ padding: '42px' }} />);
    const btn = screen.getByRole('button', { name: /log out/i });
    expect(btn).toHaveStyle({ padding: '42px' });
  });
});

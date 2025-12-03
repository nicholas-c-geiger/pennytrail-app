'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'signup-page' }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Signup failed');
      }

      await signIn('github', { callbackUrl: '/' });
    } catch (err: unknown) {
      const message = (err as Error)?.message ?? 'Unexpected error';
      console.error(err);
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div
        style={{
          width: 420,
          border: '1px solid #e6e6e6',
          borderRadius: 8,
          padding: 20,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Sign Up for Penny Trail</h1>
        <p style={{ margin: 0, marginBottom: 12 }}>
          Using your GitHub account makes it easy to sign up for a Penny Trail account.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            style={{ padding: '8px 12px' }}
          >
            {loading ? 'Working…' : 'Sign up using GitHub'}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, color: 'red' }} role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

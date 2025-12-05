'use client';

import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}
    >
      <h1>Welcome to Penny Trail</h1>
      <p style={{ margin: 0, marginBottom: 12 }}>
        Penny Trail is an expense tracking app. Anyone with a GitHub account to easily log in and
        use it.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          style={{ padding: '8px 12px' }}
        >
          Log In
        </button>
      </div>
    </main>
  );
}

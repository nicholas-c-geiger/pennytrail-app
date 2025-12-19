'use client';

import { signIn, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <p style={{ padding: '10px 20px', margin: 0 }}>
        Logged in as {session.user?.name ?? session.user?.email}
      </p>
    );
  }

  return (
    <button
      onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
      style={{ padding: '10px 20px' }}
    >
      Log In
    </button>
  );
}

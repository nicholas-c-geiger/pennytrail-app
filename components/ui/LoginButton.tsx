'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <button onClick={() => signOut()} style={{ padding: '10px 20px' }}>
        Sign out as {session.user?.name}
      </button>
    );
  } else {
    return (
      <button
        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
        style={{ padding: '10px 20px' }}
      >
        Sign in
      </button>
    );
  }
}

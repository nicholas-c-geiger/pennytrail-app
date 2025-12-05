'use client';

import { useSession, signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>You must be logged in to view this page.</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Signed in as {session.user?.email}</p>
      <button onClick={() => signOut()} style={{ padding: '8px 16px' }}>
        Log out
      </button>
    </main>
  );
}

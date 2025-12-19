'use client';

import { useSession } from 'next-auth/react';
import LogOutButton from '../../components/ui/LogOutButton';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>You must be logged in to view this page.</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Logged in as {session.user?.email}</p>
      <LogOutButton style={{ padding: '8px 16px' }} />
    </main>
  );
}

'use client';

import LoginButton from '../components/ui/LoginButton';

export default function Home() {
  return (
    <main
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}
    >
      <h1>Welcome</h1>
      <LoginButton></LoginButton>
    </main>
  );
}

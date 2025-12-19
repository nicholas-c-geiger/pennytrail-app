'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

type Props = {
  style?: React.CSSProperties;
};

export default function LogOutButton({ style }: Props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleClick = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    // Use next-auth's built-in redirect via callbackUrl
    signOut({ callbackUrl: '/' });
  };

  return (
    <button onClick={handleClick} disabled={loggingOut} style={style ?? { padding: '10px 20px' }}>
      Log Out
    </button>
  );
}

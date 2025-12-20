'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogOutButton from './LogOutButton';

export default function NavBar() {
  const pathname = usePathname() ?? '/';
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <nav
      aria-label="Main navigation"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div>
        <Link
          href="/dashboard"
          aria-current={isDashboard ? 'page' : undefined}
          style={{
            textDecoration: 'none',
            color: isDashboard ? '#0B5FFF' : 'inherit',
            fontWeight: isDashboard ? 600 : 400,
          }}
        >
          Dashboard
        </Link>
      </div>

      <div>
        <LogOutButton />
      </div>
    </nav>
  );
}

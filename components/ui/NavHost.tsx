"use client";
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function NavHost() {
  const pathname = usePathname() ?? '/';

  // Hide the nav on the external root page. Show on internal pages.
  const showNav = pathname !== '/';

  if (!showNav) return null;
  return <NavBar />;
}

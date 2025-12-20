import '../styles/globals.css';
import SessionWrapper from '../components/auth/SessionWrapper';
import NavHost from '../components/ui/NavHost';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <NavHost />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}

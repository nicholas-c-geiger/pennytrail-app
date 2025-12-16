import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import jwt from 'jsonwebtoken';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      const providerAccountId = account?.providerAccountId;
      if (!providerAccountId) {
        console.error(
          'signIn callback: missing providerAccountId, rejecting sign-in for',
          user?.email,
        );
        return false;
      }

      const API_URL = process.env.API_URL;
      if (!API_URL) {
        console.error('signIn callback: API_URL is not set; rejecting sign-in for', user?.email);
        return '/auth/error?message=service_unavailable';
      }

      const body = {
        name: user?.name,
      };

      try {
        const targetUrl = `${API_URL}/api/v1/users/${encodeURIComponent(providerAccountId)}`;
        // Build fetch options and include an authorization header.
        // Generate a short-lived JWT signed with API_SECRET and use it.
        let authHeaderValue: string | undefined;
        try {
          const secret = process.env.API_SECRET;
          if (!secret) {
            console.error(
              'API_SECRET not set; rejecting sign-in because upstream auth cannot be created.',
            );
            return '/auth/error?message=service_unavailable';
          } else {
            const payload = {
              sub: providerAccountId,
              email: user?.email,
            };
            const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '5m' });
            authHeaderValue = `Bearer ${token}`;
          }
        } catch (signErr) {
          console.error('Failed to sign JWT for upstream auth:', signErr);
          return '/auth/error?message=service_unavailable';
        }

        // Do not fall back to provider access token; require the JWT signed with API_SECRET

        // Diagnostic logs: ensure the secret and header are present at runtime
        try {
          console.log('API_SECRET defined?', !!process.env.API_SECRET);
          console.log('authHeaderValue present?', !!authHeaderValue);
          const maskedAuth = authHeaderValue
            ? String(authHeaderValue).replace(
                /^(Bearer\s+)(.+)$/,
                (_m, p1, p2) => `${p1}***${String(p2).slice(-4)}`,
              )
            : 'none';
          console.log('authHeaderValue (masked):', maskedAuth);
        } catch (diagErr) {
          console.error('Failed to log auth diagnostics:', diagErr);
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'if-none-match': '*',
          Authorization: authHeaderValue,
        };

        const fetchOptions = {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
        };

        // Helpful debug logging: show what we're about to send upstream (redact auth)
        try {
          console.log('Upstream sync: url=', targetUrl);
          console.log('Upstream sync: method=', fetchOptions.method);
          // Do not log the raw Authorization token; show redacted value instead
          const safeHeaders = { ...fetchOptions.headers } as Record<string, string | undefined>;
          if (safeHeaders.Authorization) safeHeaders.Authorization = '[REDACTED]';
          console.log('Upstream sync: headers=', safeHeaders);
          console.log('Upstream sync: body=', fetchOptions.body);
          // Log a masked Authorization header if present (do not log the token itself)
          try {
            const rawAuth = authHeaderValue;
            const masked = rawAuth
              ? rawAuth.replace(
                  /^(Bearer\s+)(.+)$/,
                  (_m, p1, p2) => `${p1}***${String(p2).slice(-4)}`,
                )
              : 'none';
            console.log('Upstream auth header (masked):', masked);
          } catch (maskErr) {
            console.error('Failed to compute masked Authorization header:', maskErr);
          }
        } catch (logErr) {
          // Protect against any accidental serialization issues in logging
          console.error('Failed to log upstream request details:', logErr);
        }

        /*
         OLD CODE (kept here so you can revert):

        const res = await fetch(
          `${API_URL}/api/v1/users/${encodeURIComponent(providerAccountId)}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'if-none-match': '*' },
            body: JSON.stringify(body),
          },
        );

        if (!res.ok) {
          const text = await res.text();
          console.error('Upstream /api/v1/users returned error:', res.status, text);
          return '/auth/error?message=service_unavailable';
        }

        return true;

        END OLD CODE
        */

        const res = await fetch(targetUrl, fetchOptions);

        if (res.status === 401) {
          // Credentials rejected by upstream
          try {
            const respHeaders = Object.fromEntries((res.headers as Headers).entries());
            console.log('Upstream response headers:', respHeaders);
          } catch (hdrErr) {
            console.error('Failed to read upstream response headers:', hdrErr);
          }
          const text = await res.text().catch(() => null);
          console.error('Upstream /api/v1/users returned 401 Unauthorized:', text);
          return '/auth/error?message=unauthorized';
        }

        if (res.status === 412) {
          // Resource already exists (If-None-Match: '*') — treat as success for sign-in
          return true;
        }

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error('Upstream /api/v1/users returned error:', res.status, text);
          return '/auth/error?message=service_unavailable';
        }

        return true;
      } catch (err) {
        console.error('Network error while creating upstream user:', err);
        return '/auth/error?message=service_unavailable';
      }
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      try {
        // Upstream sync is performed in callbacks.signIn so that sign-in can be cancelled
        // if the upstream service is unavailable. Keep this event for logging only.
      } finally {
        if (isNewUser) {
          console.log('New user signed in:', user?.email);
        } else {
          console.log('Returning user:', user?.email);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      const API_URL = process.env.API_URL;
      try {
        const githubId = account?.providerAccountId ?? (profile as { id?: string } | undefined)?.id;
        const body = {
          //githubId,
          email: user?.email,
          name: user?.name,
          //isNewUser: Boolean(isNewUser),
        };

        try {
          const res = await fetch(`${API_URL}/api/v1/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const text = await res.text().catch(() => null);
            console.error('Upstream /api/v1/users returned error:', res.status, text);
          } else {
            console.log('Upstream user created/updated for githubId', githubId);
          }
        } catch (err) {
          console.error('Network error while creating upstream user:', err);
        }
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

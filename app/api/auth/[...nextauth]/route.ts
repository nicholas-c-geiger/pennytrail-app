import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

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
      if (isNewUser) {
        console.log("New user signed in:", user.email);
        // You could trigger onboarding, analytics, or DB setup here
      } else {
        console.log("Returning user:", user.email);
      }
    },
  }
});

export { handler as GET, handler as POST };

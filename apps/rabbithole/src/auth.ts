import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as any).provider = account.provider ?? null;
        (token as any).providerAccountId = account.providerAccountId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).provider = (token as any).provider ?? null;
      (session as any).providerAccountId = (token as any).providerAccountId ?? null;
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isProtected = nextUrl.pathname.startsWith('/admin');
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      return true;
    },
  },
});

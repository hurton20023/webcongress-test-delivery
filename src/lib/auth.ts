import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        try {
          const user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });

          console.log(user);

          if (!user) return null;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token) {
        let existingUser = await prisma.users.findUnique({
          where: { email: token.email as string },
        });
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.role = existingUser?.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

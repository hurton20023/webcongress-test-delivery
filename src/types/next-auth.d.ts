import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: any;
      name?: any;
      email?: any;
      role?: any;
    } & DefaultSession["user"];
  }
}

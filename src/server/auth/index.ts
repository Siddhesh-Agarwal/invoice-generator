import {db} from "@/server/db";
import {
  Accounts,
  Sessions,
  Users,
  VerificationTokens,
} from "@/server/db/schema";
import {DrizzleAdapter} from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {auth, handlers, signIn, signOut} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: Users,
    accountsTable: Accounts,
    sessionsTable: Sessions,
    verificationTokensTable: VerificationTokens,
  }),
  providers: [Google],
  callbacks: {
    redirect: ({url, baseUrl}) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
});

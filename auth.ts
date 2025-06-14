import bcrypt from "bcryptjs";
import { HydratedDocument } from "mongoose";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccount } from "./database/account.model";
import { IUser } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<HydratedDocument<IAccount>>;

          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<HydratedDocument<IUser>>;

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    // Adds the user.id field to the session using the token.sub value (which is the user's database ID)
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    // https://authjs.dev/reference/nextjs#jwt
    // account - only available on first sign-in - includes provider info.
    async jwt({ token, account }) {
      // Checking if account exists is how we know if this is the first sign-in (either the very first time or since logging out)
      // If account is null, this is an update (i.e. session access) and we return the token as is.
      if (account) {
        // Check the backend for an existing account using:
        // - email (if using credentials)
        // - providerAccountId (GitHub/Google)
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<HydratedDocument<IAccount>>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        // If found, set token.sub = userId (critical for session linking later)
        if (userId) token.sub = userId.toString();
      }

      // Return token as is during updates (i.e whenever a session is accessed in the client)
      return token;
    },
    // user - the user object returned by the provider or your DB (https://authjs.dev/reference/nextjs#user-2)
    // profile - raw profile data from the OAuth provider (https://authjs.dev/reference/nextjs#profile)
    // account - info about the provider used (GitHub, Google, etc.) (https://authjs.dev/reference/nextjs#account)
    async signIn({ user, profile, account }) {
      // For credentials-based login (if supported later), always return true
      // https://authjs.dev/reference/core/providers#providertype
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      // If OAuth (GitHub or Google):
      // 1. Construct a userInfo object
      // 2. Send it to the backend (api.auth.oAuthSignIn) to create or update the account
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        // Username is auto-generated when signing in with OAuth.
        // This will be sluggified later in the backend.
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      // Pass the user, provider, and providerAccountId to the backend API when signing in with OAuth
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      // If unsuccessful, sign-in fails.
      if (!success) return false;

      return true;
    },
  },
});

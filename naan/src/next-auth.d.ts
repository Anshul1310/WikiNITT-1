import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id: string;
      username?: string;
      displayName?: string;
      setupComplete?: boolean;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    backendToken?: string;
    gender?: string;
    phoneNumber?: string;
    username?: string;
    displayName?: string;
    setupComplete?: boolean;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    username?: string;
    displayName?: string;
    setupComplete?: boolean;
    isAdmin?: boolean;
  }
}

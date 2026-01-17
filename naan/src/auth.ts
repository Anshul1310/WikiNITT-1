import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { GraphQLClient } from "graphql-request";
import { gql } from "@/gql";
import { ADMIN_LOGIN_MUTATION } from "@/gql/admin";
import { GetCurrentUserQuery } from "@/gql/graphql";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = new GraphQLClient(
          process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
        );

        try {
          const data = await client.request<{ login: string }>(
            ADMIN_LOGIN_MUTATION,
            {
              input: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          );

          if (data.login) {
            return {
              id: "admin",
              email: credentials.email as string,
              name: "Admin",
              backendToken: data.login,
              isAdmin: true,
              setupComplete: true,
            };
          }
          return null;
        } catch (error) {
          console.error("Admin Login Failed:", error);
          return null;
        }
      },
    }),
    {
      id: "dauth",
      name: "Dauth",
      type: "oauth",
      authorization: {
        url: "https://auth.delta.nitt.edu/authorize",
        params: { scope: "user" },
      },
      token: {
        url: "https://auth.delta.nitt.edu/api/oauth/token",
      },
      userinfo: {
        url: "https://auth.delta.nitt.edu/api/resources/user",
        async request({ tokens, provider }: { tokens: any; provider: any }) {
          const res = await fetch(provider.userinfo?.url!, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Userinfo failed: ${text}`);
          }

          return await res.json();
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name,
          email: profile.email,
          gender: profile.gender,
          phoneNumber: profile.phoneNumber,
        };
      },
      clientId: process.env.DAUTH_CLIENT_ID,
      clientSecret: process.env.DAUTH_CLIENT_SECRET,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, user, profile, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.user) {
          token.username = session.user.username;
          token.displayName = session.user.displayName;
          token.setupComplete = session.user.setupComplete;
        }
        return token;
      }

      if (user) {
        if (account?.provider === "credentials") {
          token.backendToken = (user as User).backendToken;
          token.isAdmin = true;
          token.setupComplete = true;
          return token;
        }

        const mutation = gql(`
        mutation SignIn($input: NewUser!) {
          signIn(input: $input)
        }
          `);

        const graphQLClient = new GraphQLClient(
          process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
        );

        try {
          const response = await graphQLClient.request(mutation, {
            input: {
              id: String(profile!.id!),
              name: user.name!,
              email: user.email!,
              gender: user.gender!,
              phoneNumber: user.phoneNumber!,
              machineToken: process.env.MACHINE_TOKEN!,
            },
          });
          token.backendToken = response.signIn;

          const userQuery = gql(`
            query GetCurrentUser {
              me {
                id
                username
                displayName
                setupComplete
                isAdmin
              }
            }
          `);

          try {
            const authenticatedClient = new GraphQLClient(
              process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
              {
                headers: {
                  Authorization: `Bearer ${token.backendToken}`,
                },
              },
            );

            const userData =
              await authenticatedClient.request<GetCurrentUserQuery>(userQuery);
            if (userData.me) {
              token.username = userData.me.username;
              token.displayName = userData.me.displayName;
              token.setupComplete = userData.me.setupComplete;
              token.isAdmin = userData.me.isAdmin;
              token.id = userData.me.id;
            } else {
            }
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        } catch (error) {
          console.error("Backend Sync Failed:", error);
        }
      }

      if (token.backendToken && !token.id) {
        const userQuery = gql(`
            query GetCurrentUser {
              me {
                id
                username
                displayName
                setupComplete
                isAdmin
              }
            }
          `);

        try {
          const authenticatedClient = new GraphQLClient(
            process.env.NEXT_PUBLIC_GRAPHQL_API_URL!,
            {
              headers: {
                Authorization: `Bearer ${token.backendToken}`,
              },
            },
          );

          const userData =
            await authenticatedClient.request<GetCurrentUserQuery>(userQuery);
          if (userData.me) {
            token.username = userData.me.username;
            token.displayName = userData.me.displayName;
            token.setupComplete = userData.me.setupComplete;
            token.isAdmin = userData.me.isAdmin;
            token.id = userData.me.id;
          }
        } catch (error) {
          console.error("Failed to refresh user details:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.backendToken) {
        session.backendToken = token.backendToken as string;
      }
      if (token.isAdmin) {
        session.user.isAdmin = true;
      }

      if (token.username) session.user.username = token.username as string;
      if (token.displayName)
        session.user.displayName = token.displayName as string;
      if (token.setupComplete !== undefined)
        session.user.setupComplete = token.setupComplete as boolean;

      if (token.id) {
        session.user.id = token.id as string;
      } else if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});

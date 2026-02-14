import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitterProvider from "next-auth/providers/twitter";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

const InstagramProvider = (
  options: OAuthUserConfig<Record<string, unknown>>
): OAuthConfig<Record<string, unknown>> => ({
  id: "instagram",
  name: "Instagram",
  type: "oauth",
  authorization: {
    url: "https://www.facebook.com/v20.0/dialog/oauth",
    params: {
      scope: "instagram_basic,instagram_manage_comments"
    }
  },
  token: "https://graph.facebook.com/v20.0/oauth/access_token",
  userinfo: "https://graph.instagram.com/me?fields=id,username",
  profile(profile) {
    return {
      id: String(profile.id),
      name: String(profile.username ?? "Instagram User"),
      email: null
    };
  },
  ...options
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID ?? "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET ?? "",
      version: "2.0"
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? ""
    }),
    InstagramProvider({
      clientId: process.env.META_APP_ID ?? "",
      clientSecret: process.env.META_APP_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { user: { id: string; email: string; name?: string } };
        return data.user;
      }
    })
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider && account.access_token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/platforms/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.JWT_SECRET ?? "stub"}`
          },
          body: JSON.stringify({
            platform: account.provider.toUpperCase(),
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            platformUserId: user.id
          })
        }).catch(() => undefined);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
};


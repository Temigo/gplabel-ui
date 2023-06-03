import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'

import GitHub from 'next-auth/providers/github'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import Adapter from "./adapter" // DB adapter

export const authOptions: NextAuthOptions = {
    site: process.env.NEXTAUTH_URL == undefined ? "" : process.env.NEXTAUTH_URL,
    theme: {
      colorScheme: "light"
    },
    adapter: Adapter(),
    session: {
        strategy: "database"
    },
    // Define here login methods
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID == undefined ? "" : process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET == undefined ? "" : process.env.GITHUB_SECRET
      }),
      Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      CredentialsProvider({
          name: "Sign in with email",
          credentials: {
              username: { label: "Username", type: "text", placeholder: "" },
              password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
              // TODO connect with backend to check authentication?
              const user = { id: "1", name: "John", email: "john@example.com" };
              if (user) {
                  return user;
              } else {
                  return null;
              }
          }
      })
      ],
      callbacks: {
          async redirect({ url, baseUrl }) {
              console.log('redirect', url, baseUrl)
            return url.startsWith(baseUrl)
              ? url
              : baseUrl
          }
      }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'

import GitHub from 'next-auth/providers/github'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import Adapter from "./adapter" // DB adapter


export const authOptions: NextAuthOptions = {
    //site: process.env.NEXTAUTH_URL == undefined ? "" : process.env.NEXTAUTH_URL,
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
          async session({ session, token, user }) {
            console.log('callback', token, user)
            // Send properties to the client, like an access_token and user id from a provider.
            // session.accessToken = token.accessToken
            session.user.id = user.id
            session.user.annotations = user.annotations
            session.user.images = user.images

            return session
          }
      }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import bcryptjs from "bcryptjs";


// const authenticatedRoutes = [
//   'checkout/address'
// ]

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   console.log({auth})
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = authenticatedRoutes;
    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL('/', nextUrl));
    //   }
    //   return true;
    // },

    jwt({token, user}) {
      if(user){
        token.data = user
      }
      return token
    },
    session({session, token, user}){
      session.user = token.data as any;
      return session
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;
        const { email, password } = parsedCredentials.data;

        //Buscar correro
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (!user) return null;
        //Comparar contraseñas
        if (!bcryptjs.compareSync(password, user.password)) return null;
        //retonar usuario sin el password
        const {password: _, ...rest} = user;
        return rest;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);

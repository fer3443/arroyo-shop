import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import bcryptjs from "bcryptjs";


const PROTECTED_PATHS = [
  {path:'/checkout', allowedRoles: ['admin', 'user']},
  {path:'/orders', allowedRoles: ['admin', 'user']},
  {path:'/admin', allowedRoles: ['admin']},
]

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const role = auth?.user?.role ?? 'unauthenticated';
    //   const protectedPath = PROTECTED_PATHS.find(({path}) => nextUrl?.pathname.includes(path))
    //   const canAccessPath = !protectedPath || protectedPath.allowedRoles.includes(role)
    //   return canAccessPath;
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

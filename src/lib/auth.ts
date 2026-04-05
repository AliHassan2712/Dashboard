import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/src/lib/prisma";
import { ROUTES } from "../constants/routes";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role?: string;
    phone?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone Number",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "05XXXXXXXX" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("الرجاء إدخال رقم الهاتف وكلمة المرور");
        }

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) throw new Error("رقم الهاتف غير مسجل في النظام");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) throw new Error("كلمة المرور غير صحيحة");

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: { signIn: `${ROUTES.LOGIN}` },
};
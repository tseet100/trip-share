import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string | undefined)?.toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.hashedPassword) return null;
        const ok = await bcrypt.compare(password, user.hashedPassword);
        if (!ok) return null;
        return { id: user.id, name: user.name ?? undefined, email: user.email } as any;
      },
    }),
  ],
  pages: { signIn: "/signin" },
};



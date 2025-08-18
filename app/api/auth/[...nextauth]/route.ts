import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { GET, POST } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        return { id: email, name: email.split("@")[0], email };
      },
    }),
  ],
});



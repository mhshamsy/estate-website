import NextAuth from "next-auth";
import prisma from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { schema } from "./schema";
import { compare } from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // ✅ ADD THIS: Session configuration
  session: {
    strategy: "jwt", // Use JWT tokens for sessions
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);
        // console.log(validatedCredentials)
        // ۱. پیدا کردن کاربر فقط با ایمیل (نه با پسورد!)
        const user = await prisma.user.findFirst({
          where: { email: validatedCredentials.email },
        });

        if (!user?.email || !user?.password) {
          console.log(
            "❌ No user found with email or password:",
            validatedCredentials.email
          );
          return null; // بهتره null برگردونی تا ارور نده
        }

        // ۲. مقایسه پسورد با استفاده از bcrypt
        const isPasswordValid = await compare(
          validatedCredentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log("❌ Invalid password for user:", user.email);
          return null;
        } // ✅ نکته مهم: id باید string باشد
        else
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role,
            //image: user.image,
          };
      },

      /* authorize: async (credentials) => {
                const email = "a";
                const password = 'a';

                if (credentials.email === email && credentials.password === password) { return { email, password } } else { throw new Error("Invalid credentials") }
            } */
    }),
  ],

  // ✅ ADD THIS: Callbacks to handle JWT and session
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, add their ID to the token
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { role: true },
        });
        token.role = dbUser?.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Make user ID available in the session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },

  // ✅ ADD THIS: Custom pages
  pages: {
    signIn: "/sign-in", // Your custom login page
  },
});

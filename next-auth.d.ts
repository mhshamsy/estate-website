import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER"; // اضافه کردن role
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "USER"; // اضافه کردن role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER"; // اضافه کردن role
  }
}

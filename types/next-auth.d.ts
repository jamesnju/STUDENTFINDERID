import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      role: string;
      name: string;
      reason: string;
    };
  }

  interface JWT {
    id: number;
    email: string;
    role: string;
    name: string;
    reason: string;
  }
}
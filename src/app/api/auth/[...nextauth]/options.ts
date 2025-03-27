import { getUser } from "@/actions/User";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type UserWithRole = User & {
  id: string;
  email: string;
  role?: string;
  name?: string;
  reason?: string;
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await getUser(
            credentials?.email as string,
            credentials?.password as string
          );
      
          //console.log("Fetched User:", response);
      
          if (response?.user) {
            return {
              id: response.user.id,
              email: response.user.email,
              role: response.user.role,
              name: response.user.name,
              reason: response.user.reason,
            } as UserWithRole;
          } else {
            return null;
          }
        } catch (error) {
          //console.error("Authorization error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      //console.log("User object in JWT:", user);

      if (user) {
        const userWithRole = user as UserWithRole;
        token.id = userWithRole.id;
        token.email = userWithRole.email;
        token.role = userWithRole.role;
        token.name = userWithRole.name;
        token.reason = userWithRole.reason;
      }
      //console.log("JWT Token:-----------------", token);
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as number,
        email: token.email as string,
        role: token.role as string,
        name: token.name as string,
        reason: token.reason as string,
      };
      //console.log("Session object:-------------------", session);
      return session;
    },
  },
};

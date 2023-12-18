import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prismadb from "../../../lib/prismadb";

// Configuration options for authentication
export const authOptions: AuthOptions = {
  providers: [
    // GitHub authentication provider
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // Google authentication provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Custom credentials provider for email/password-based authentication
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // Authorization function for custom credentials provider
      async authorize(credentials) {
        // Check if email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Fetch user from the Prisma database based on the provided email
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Check if the user or hashed password does not exist
        if (!user || !user.hashedPassword) {
          throw new Error("Email does not exist");
        }

        // Compare the provided password with the hashed password stored in the database
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        // If the password is incorrect, throw an error
        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        // Return the user object if authentication is successful
        return user;
      },
    }),
  ],
  // Custom sign-in page path
  pages: {
    signIn: "/auth",
  },
  // Enable debugging in development mode
  debug: process.env.NODE_ENV === "development",
  // Adapter for using Prisma with NextAuth (for managing sessions in the database)
  adapter: PrismaAdapter(prismadb),
  // JWT (JSON Web Tokens) configuration for session management.
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  // Secures cookies using secrets from environment variables
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the NextAuth function with the specified configuration
export default NextAuth(authOptions);

import { PrismaClient } from "@prisma/client";

// Create a global PrismaClient instance or use an existing one
const client = global.prismadb || new PrismaClient();
// In production, reuse the same PrismaClient instance across requests
if (process.env.NODE_ENV === "production") global.prismadb = client;

export default client;

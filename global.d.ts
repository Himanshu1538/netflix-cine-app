import { PrismaClient } from "@prisma/client";
import type { MongoClient } from "mongodb";

// Declare a global namespace augmentation for the `globalThis` object
declare global {
  // Augment the `globalThis` namespace
  namespace globalThis {
    // Add a property named `prismadb` of type `PrismaClient` to `globalThis`
    var prismadb: PrismaClient;
  }
}

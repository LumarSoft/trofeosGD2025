import { PrismaClient } from "@prisma/client";

// Declare global variable to avoid multiple instances in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Use a singleton pattern to avoid multiple connections
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Avoid instantiating multiple instances in development
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;

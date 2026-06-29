/**
 * Prisma client singleton. Re-importable from web + worker.
 * We export `prisma` as the singleton instance so dev-mode Next.js hot reload
 * does not spawn a new pool on every request.
 */
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __instalovonPrisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__instalovonPrisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["error", "warn", "info"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__instalovonPrisma = prisma;
}

export * from "@prisma/client";

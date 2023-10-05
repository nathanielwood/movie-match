import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis"

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : new Redis()
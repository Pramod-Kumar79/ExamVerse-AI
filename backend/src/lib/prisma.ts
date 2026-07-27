import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { env } from "../config/env";
import { logger } from "./logger";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

export const prisma = global.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// prisma
//   .$connect()
//   .then(() => {
//     logger.info("✅ Connected to PostgreSQL (Neon)");
//   })
//   .catch((error) => {
//     logger.error(error);
//     process.exit(1);
//   });

export default prisma;

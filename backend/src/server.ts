import "dotenv/config";

import app from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import prisma from "./lib/prisma";

import "./lib/prisma";

const PORT = env.PORT;

async function start() {
  try {
    await prisma.$connect();

    logger.info("✅ Connected to PostgreSQL (Neon)");

    app.listen(env.PORT, () => {
      logger.info(`🚀 ExamVerse AI Backend running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();


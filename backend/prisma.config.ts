import "dotenv/config";
import { defineConfig, env } from "prisma/config"; // Ensure env is imported here

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"), // Strips away "process.env" completely
  },
});

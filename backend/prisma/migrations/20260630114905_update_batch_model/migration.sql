/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "academicYear" TEXT,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "semester" INTEGER,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_code_key" ON "Batch"("code");

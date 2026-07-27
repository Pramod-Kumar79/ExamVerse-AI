/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Question` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "estimatedTime" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN     "marks" INTEGER,
ADD COLUMN     "negativeMarks" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "year" INTEGER;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

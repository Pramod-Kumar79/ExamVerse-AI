/*
  Warnings:

  - You are about to drop the column `options` on the `AIExtractedQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `AIExtractedQuestion` table. All the data in the column will be lost.
  - The `difficulty` column on the `AIExtractedQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `answer` column on the `AIExtractedQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `modelName` to the `AIExtractedQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processingJobId` to the `AIExtractedQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `AIExtractedQuestion` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `questionType` on the `AIExtractedQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AIExtractedQuestion" DROP COLUMN "options",
DROP COLUMN "publishedAt",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "modelName" TEXT NOT NULL,
ADD COLUMN     "processingJobId" TEXT NOT NULL,
ADD COLUMN     "processingTimeMs" INTEGER,
ADD COLUMN     "promptVersion" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "reviewComment" TEXT,
ADD COLUMN     "reviewNotes" TEXT,
DROP COLUMN "questionType",
ADD COLUMN     "questionType" "QuestionType" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "DifficultyLevel",
DROP COLUMN "answer",
ADD COLUMN     "answer" JSONB,
ALTER COLUMN "confidence" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "AIExtractedQuestionOption" (
    "id" TEXT NOT NULL,
    "extractedQuestionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIExtractedQuestionOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIExtractedQuestion" ADD CONSTRAINT "AIExtractedQuestion_processingJobId_fkey" FOREIGN KEY ("processingJobId") REFERENCES "ProcessingJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIExtractedQuestion" ADD CONSTRAINT "AIExtractedQuestion_publishedQuestionId_fkey" FOREIGN KEY ("publishedQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIExtractedQuestionOption" ADD CONSTRAINT "AIExtractedQuestionOption_extractedQuestionId_fkey" FOREIGN KEY ("extractedQuestionId") REFERENCES "AIExtractedQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

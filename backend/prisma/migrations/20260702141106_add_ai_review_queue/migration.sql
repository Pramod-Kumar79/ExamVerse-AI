-- CreateEnum
CREATE TYPE "AIReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AIExtractedQuestion" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "subject" TEXT,
    "chapter" TEXT,
    "topic" TEXT,
    "difficulty" TEXT,
    "marks" INTEGER,
    "negativeMarks" INTEGER,
    "questionText" TEXT NOT NULL,
    "options" JSONB,
    "answer" TEXT,
    "explanation" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" "AIReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIExtractedQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIExtractedQuestion" ADD CONSTRAINT "AIExtractedQuestion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "UploadedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIExtractedQuestion" ADD CONSTRAINT "AIExtractedQuestion_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

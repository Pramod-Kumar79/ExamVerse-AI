-- DropForeignKey
ALTER TABLE "Exam" DROP CONSTRAINT "Exam_courseId_fkey";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "isPractice" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

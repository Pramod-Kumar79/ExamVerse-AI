/*
  Warnings:

  - You are about to drop the column `fileName` on the `UploadedDocument` table. All the data in the column will be lost.
  - You are about to drop the column `storageUrl` on the `UploadedDocument` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `UploadedDocument` table. All the data in the column will be lost.
  - Added the required column `extension` to the `UploadedDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `UploadedDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storedName` to the `UploadedDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `UploadedDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentStatus" ADD VALUE 'READY_FOR_PROCESSING';
ALTER TYPE "DocumentStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "UploadedDocument" DROP COLUMN "fileName",
DROP COLUMN "storageUrl",
DROP COLUMN "uploadedBy",
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "storedName" TEXT NOT NULL,
ADD COLUMN     "uploadedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UploadedDocument" ADD CONSTRAINT "UploadedDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

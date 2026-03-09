/*
  Warnings:

  - You are about to drop the column `cognitoSub` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registryCognitoSub]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleCognitoSub]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_cognitoSub_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cognitoSub",
ADD COLUMN     "googleCognitoSub" TEXT,
ADD COLUMN     "registryCognitoSub" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_registryCognitoSub_key" ON "User"("registryCognitoSub");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleCognitoSub_key" ON "User"("googleCognitoSub");

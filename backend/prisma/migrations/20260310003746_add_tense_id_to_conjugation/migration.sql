/*
  Warnings:

  - The primary key for the `Conjugation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `tense_id` to the `Conjugation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conjugation" DROP CONSTRAINT "Conjugation_pkey",
ADD COLUMN     "tense_id" UUID NOT NULL,
ADD CONSTRAINT "Conjugation_pkey" PRIMARY KEY ("verb_id", "subject_id", "tense_id");

-- AddForeignKey
ALTER TABLE "Conjugation" ADD CONSTRAINT "Conjugation_tense_id_fkey" FOREIGN KEY ("tense_id") REFERENCES "Tense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

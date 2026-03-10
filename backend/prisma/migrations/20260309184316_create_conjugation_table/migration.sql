-- CreateTable
CREATE TABLE "Conjugation" (
    "verb_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Conjugation_pkey" PRIMARY KEY ("verb_id","subject_id")
);

-- AddForeignKey
ALTER TABLE "Conjugation" ADD CONSTRAINT "Conjugation_verb_id_fkey" FOREIGN KEY ("verb_id") REFERENCES "Verb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conjugation" ADD CONSTRAINT "Conjugation_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

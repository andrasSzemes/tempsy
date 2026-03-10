-- CreateTable
CREATE TABLE "Irregular" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "verb_id" UUID NOT NULL,
    "tense_id" UUID NOT NULL,

    CONSTRAINT "Irregular_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Irregular_verb_id_tense_id_key" ON "Irregular"("verb_id", "tense_id");

-- AddForeignKey
ALTER TABLE "Irregular" ADD CONSTRAINT "Irregular_verb_id_fkey" FOREIGN KEY ("verb_id") REFERENCES "Verb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Irregular" ADD CONSTRAINT "Irregular_tense_id_fkey" FOREIGN KEY ("tense_id") REFERENCES "Tense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

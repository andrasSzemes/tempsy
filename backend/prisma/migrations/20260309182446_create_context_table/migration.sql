-- CreateTable
CREATE TABLE "Context" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "verb_id" UUID NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_verb_id_fkey" FOREIGN KEY ("verb_id") REFERENCES "Verb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

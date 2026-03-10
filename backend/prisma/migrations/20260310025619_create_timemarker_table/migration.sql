-- CreateTable
CREATE TABLE "TimeMarker" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "tense_id" UUID NOT NULL,

    CONSTRAINT "TimeMarker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeMarker" ADD CONSTRAINT "TimeMarker_tense_id_fkey" FOREIGN KEY ("tense_id") REFERENCES "Tense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Tense" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Tense_pkey" PRIMARY KEY ("id")
);

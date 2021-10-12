-- CreateEnum
CREATE TYPE "ApproximateCountKind" AS ENUM ('shortened_urls', 'visits');

-- CreateTable
CREATE TABLE "approximate_counts" (
    "kind" "ApproximateCountKind" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approximate_counts_pkey" PRIMARY KEY ("kind")
);

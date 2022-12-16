-- CreateTable
CREATE TABLE "blocked_hostnames" (
    "hostname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_hostnames_pkey" PRIMARY KEY ("hostname")
);

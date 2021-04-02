/*
  Warnings:

  - The primary key for the `visits` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "visits.shortened_url_base64_index" ON "visits"("shortened_url_base64");

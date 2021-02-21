/*
  Warnings:

  - The migration will change the primary key for the `visits` table. If it partially fails, the table could be left without primary key constraint.
  - Made the column `shortened_url_base64` on table `visits` required. The migration will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "visits.shortened_url_base64_index";

-- AlterTable
ALTER TABLE "visits" DROP CONSTRAINT "visits_pkey",
ALTER COLUMN "shortened_url_base64" SET NOT NULL,
ADD PRIMARY KEY ("shortened_url_base64", "timestamp");

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_shortened_url_base64_fkey";

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_shortened_url_base64_fkey" FOREIGN KEY ("shortened_url_base64") REFERENCES "shortened_urls"("short_base64") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "visits.shortened_url_base64_index" RENAME TO "visits_shortened_url_base64_idx";

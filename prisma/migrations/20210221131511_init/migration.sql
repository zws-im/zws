-- CreateTable
CREATE TABLE "shortened_urls" (
    "short_base64" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("short_base64")
);

-- CreateTable
CREATE TABLE "visits" (
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shortened_url_base64" TEXT,

    PRIMARY KEY ("timestamp")
);

-- CreateIndex
CREATE INDEX "visits.shortened_url_base64_index" ON "visits"("shortened_url_base64");

-- AddForeignKey
ALTER TABLE "visits" ADD FOREIGN KEY ("shortened_url_base64") REFERENCES "shortened_urls"("short_base64") ON DELETE SET NULL ON UPDATE CASCADE;

-- IF NOT EXISTS preserves the index already built CONCURRENTLY in production.
-- The deployment applies the remaining changes and records this migration.
CREATE INDEX IF NOT EXISTS "visits_url_short_base64_timestamp_index" ON "visits" ("url_short_base64","timestamp");--> statement-breakpoint
DROP INDEX IF EXISTS "visits_url_short_base64_index";--> statement-breakpoint
DROP INDEX IF EXISTS "visits_timestamp_index";

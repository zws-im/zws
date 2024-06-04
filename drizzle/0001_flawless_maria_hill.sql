DROP INDEX IF EXISTS "urls_blocked_index";--> statement-breakpoint
DROP INDEX IF EXISTS "urls_url_index";--> statement-breakpoint
DROP INDEX IF EXISTS "visits_url_short_base64_index";--> statement-breakpoint
DROP INDEX IF EXISTS "visits_timestamp_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "urls_blocked_index" ON "urls" USING hash (blocked);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "urls_url_index" ON "urls" USING hash (url);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visits_url_short_base64_index" ON "visits" USING hash (url_short_base64);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visits_timestamp_index" ON "visits" USING btree (timestamp);
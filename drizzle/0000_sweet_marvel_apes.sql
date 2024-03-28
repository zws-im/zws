CREATE TABLE IF NOT EXISTS "blocked_hostnames" (
	"hostname" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "urls" (
	"blocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"short_base64" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"url_short_base64" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "urls_blocked_index" ON "urls" ("blocked");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "urls_url_index" ON "urls" ("url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visits_url_short_base64_index" ON "visits" ("url_short_base64");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visits_timestamp_index" ON "visits" ("timestamp");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visits" ADD CONSTRAINT "visits_url_short_base64_urls_short_base64_fk" FOREIGN KEY ("url_short_base64") REFERENCES "urls"("short_base64") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

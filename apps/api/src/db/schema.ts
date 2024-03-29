import { boolean, index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const blockedHostnames = pgTable('blocked_hostnames', {
	hostname: text('hostname').primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const urls = pgTable(
	'urls',
	{
		blocked: boolean('blocked').default(false).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		shortBase64: text('short_base64').notNull().primaryKey(),
		url: text('url').notNull(),
	},
	(urls) => ({
		blockedIdx: index().on(urls.blocked),
		urlIdx: index().on(urls.url),
	}),
);

export const visits = pgTable(
	'visits',
	{
		id: serial('id').primaryKey().notNull(),
		timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
		urlShortBase64: text('url_short_base64')
			.references(() => urls.shortBase64, { onDelete: 'cascade', onUpdate: 'cascade' })
			.notNull(),
	},
	(visits) => ({
		urlShortBase64Idx: index().on(visits.urlShortBase64),
		timestampIdx: index().on(visits.timestamp),
	}),
);

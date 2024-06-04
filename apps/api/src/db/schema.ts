import { boolean, index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const blockedHostnames = pgTable('blocked_hostnames', {
	hostname: text('hostname').primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// As of writing, Drizzle doesn't honor the `.using()` method for indexes (https://github.com/drizzle-team/drizzle-orm/issues/1349)
// It will just ignore it and use the default (BTREE) every time
// At some point they will fix this, and trying to create a migration will suddenly include those index changes

export const urls = pgTable('urls', {
	blocked: boolean('blocked').default(false).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	shortBase64: text('short_base64').notNull().primaryKey(),
	url: text('url').notNull(),
});

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
		// prettier-ignore
		urlShortBase64Idx: index().using('hash', visits.urlShortBase64),
		timestampIdx: index().on(visits.timestamp),
	}),
);

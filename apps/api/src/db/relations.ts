import { defineRelations } from 'drizzle-orm';
import * as schema from './schema.js';

export const relations = defineRelations(schema, (r) => ({
	blockedHostnames: {},
	urls: {
		visits: r.many.visits({
			from: r.urls.shortBase64,
			to: r.visits.urlShortBase64,
		}),
	},
	visits: {
		url: r.one.urls({
			from: r.visits.urlShortBase64,
			to: r.urls.shortBase64,
			optional: false,
		}),
	},
}));

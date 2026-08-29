#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { count, desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from 'redis';
import * as Schema from '../src/db/schema.ts';

const { values } = parseArgs({
	options: {
		apply: { type: 'boolean' },
		'dry-run': { type: 'boolean' },
		help: { short: 'h', type: 'boolean' },
		hostname: { type: 'string' },
		'target-url': { type: 'string' },
		url: { type: 'string' },
	},
});

const usage = `Usage:
  node scripts/block-malicious-url.ts (--dry-run | --apply) [--url <zws-url>] [--target-url <url>] [--hostname <domain>]`;

if (values.help) {
	console.log(usage);
	process.exit(0);
}

if (values['dry-run'] === values.apply) {
	throw new RangeError(`${usage}\n\nPass exactly one of --dry-run or --apply.`);
}

if (!values.url && !values['target-url'] && !values.hostname) {
	throw new RangeError(`${usage}\n\nPass at least one target.`);
}

if (!process.env.DATABASE_URL || (values.apply && !process.env.REDIS_URL)) {
	throw new TypeError('Missing required production database or Redis configuration.');
}

function normalizeHostname(value: string): string {
	const url = new URL(`https://${value.toLowerCase().replace(/\.$/, '')}`);

	if (url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash) {
		throw new RangeError(`Invalid hostname: ${value}`);
	}

	return url.hostname;
}

async function resolveTarget(): Promise<{ hostname: string; targetUrl?: string }> {
	let targetUrl = values['target-url'];

	if (values.url) {
		const shortUrl = new URL(values.url);

		if (!['zws.im', 'api.zws.im'].includes(shortUrl.hostname)) {
			throw new RangeError('--url must use zws.im or api.zws.im. Use --target-url for a destination URL.');
		}

		for (const hostname of [shortUrl.hostname, shortUrl.hostname === 'zws.im' ? 'api.zws.im' : 'zws.im']) {
			shortUrl.hostname = hostname;
			const response = await fetch(shortUrl, { redirect: 'manual' });
			const location = response.headers.get('location');
			targetUrl = location ? new URL(location, shortUrl).toString() : targetUrl;

			if (targetUrl) break;
		}
	}

	const resolvedHostname = targetUrl ? new URL(targetUrl).hostname : undefined;
	const explicitHostname = values.hostname ? normalizeHostname(values.hostname) : undefined;

	if (resolvedHostname && explicitHostname && resolvedHostname !== explicitHostname) {
		throw new RangeError(`Resolved hostname ${resolvedHostname} does not match ${explicitHostname}.`);
	}

	const hostname = explicitHostname ?? resolvedHostname;

	if (!hostname) {
		throw new RangeError('Could not determine the destination hostname. Pass --hostname explicitly.');
	}

	return { hostname, targetUrl };
}

function hostnamePattern(hostname: string): string {
	const escaped = hostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return `^https?://([^/@?#]+@)?([^/?#@]*\\.)?${escaped}(:[0-9]+)?([/?#]|$)`;
}

const target = await resolveTarget();
const postgresClient = postgres(process.env.DATABASE_URL, {
	max: 1,
	connect_timeout: 5,
	connection: { application_name: 'zws-block-malicious-url' },
});
const db = drizzle({ client: postgresClient });

try {
	const pattern = hostnamePattern(target.hostname);
	const matchesHostname = sql`${Schema.urls.url} ~* ${pattern}`;
	const [blocked, matches] = await Promise.all([
		db
			.select({ hostname: Schema.blockedHostnames.hostname })
			.from(Schema.blockedHostnames)
			.where(eq(Schema.blockedHostnames.hostname, target.hostname))
			.limit(1),
		db
			.select({
				total: count(),
				unblocked: sql<number>`count(*) filter (where ${Schema.urls.blocked} = false)::int`,
			})
			.from(Schema.urls)
			.where(matchesHostname),
	]);

	const result: Record<string, unknown> = {
		mode: values.apply ? 'apply' : 'dry-run',
		hostname: target.hostname,
		alreadyBlocked: blocked.length === 1,
		matchingUrls: matches[0]?.total ?? 0,
		unblockedUrls: matches[0]?.unblocked ?? 0,
	};

	if (values.apply) {
		const [inserted, sample] = await Promise.all([
			db
				.insert(Schema.blockedHostnames)
				.values({ hostname: target.hostname })
				.onConflictDoNothing()
				.returning({ hostname: Schema.blockedHostnames.hostname }),
			db
				.select({ shortBase64: Schema.urls.shortBase64 })
				.from(Schema.urls)
				.where(matchesHostname)
				.orderBy(desc(Schema.urls.createdAt))
				.limit(1),
		]);
		const redis = createClient({ url: process.env.REDIS_URL });
		await redis.connect();

		try {
			result.hostnameInserted = inserted.length === 1;
			result.redisAdded = (await redis.sAdd('blocked-hostnames', target.hostname)) === 1;
			await redis.expire('blocked-hostnames', 1800);
		} finally {
			await redis.close();
		}

		const shortUrl = values.url
			? new URL(values.url)
			: sample[0]
				? new URL(encodeURIComponent(Buffer.from(sample[0].shortBase64, 'base64').toString()), 'https://zws.im')
				: undefined;

		if (shortUrl) {
			shortUrl.hostname = 'zws.im';
			const apiUrl = new URL(shortUrl);
			apiUrl.hostname = 'api.zws.im';
			const [web, api] = await Promise.all([
				fetch(shortUrl, { redirect: 'manual' }),
				fetch(apiUrl, { redirect: 'manual' }),
			]);
			result.verification = {
				web: { location: web.headers.get('location'), status: web.status },
				api: { location: api.headers.get('location'), status: api.status },
			};
		}
	}

	console.log(JSON.stringify(result, null, 2));
} finally {
	await postgresClient.end({ timeout: 5 });
}

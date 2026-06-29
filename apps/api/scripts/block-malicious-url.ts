#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { and, desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { createClient } from 'redis';
import * as Schema from '../src/db/schema.ts';

const { values } = parseArgs({
	options: {
		apply: { type: 'boolean' },
		'dry-run': { type: 'boolean' },
		hostname: { type: 'string' },
		'target-url': { type: 'string' },
		url: { type: 'string' },
	},
});

const usage = `Usage:
  node scripts/block-malicious-url.ts (--dry-run | --apply) [--url <zws-url>] [--target-url <url>] [--hostname <domain>]
`;

const dryRun = values['dry-run'] === true;
const apply = values.apply === true;

if (dryRun === apply) {
	throw new Error(`${usage}\nPass exactly one of --dry-run or --apply`);
}

if (!values.url && !values['target-url'] && !values.hostname) {
	throw new Error(`${usage}\nPass at least one of --url, --target-url, or --hostname`);
}

if (!process.env.DATABASE_URL) {
	throw new Error('Missing DATABASE_URL');
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function shortBase64(rawUrl: string | undefined): string | undefined {
	if (!rawUrl) {
		return undefined;
	}

	const rawShort = decodeURIComponent(new URL(rawUrl).pathname.slice(1));
	const rewrites = JSON.parse(process.env.SHORT_REWRITES || '{}') as Record<string, string>;
	const short = Object.entries(rewrites).reduce((value, [from, to]) => value.replaceAll(from, to), rawShort);

	return short ? Buffer.from(short).toString('base64') : undefined;
}

async function targetFromInput(): Promise<{ hostname: string; redirectStatus?: number; resolvedTargetUrl?: string }> {
	if (values['target-url']) {
		const targetUrl = new URL(values['target-url']);
		return { hostname: values.hostname ?? targetUrl.hostname, resolvedTargetUrl: targetUrl.toString() };
	}

	if (!values.url) {
		if (!values.hostname) {
			throw new Error('Could not determine hostname. Pass --hostname explicitly.');
		}

		return { hostname: values.hostname };
	}

	const response = await fetch(values.url, { redirect: 'manual' });
	let location = response.headers.get('location');
	let redirectStatus = response.status;

	if (!location) {
		const apiUrl = new URL(values.url);
		apiUrl.hostname = 'api.zws.im';

		if (apiUrl.toString() !== values.url) {
			const apiResponse = await fetch(apiUrl, { redirect: 'manual' });
			location = apiResponse.headers.get('location');
			redirectStatus = apiResponse.status;
		}
	}

	if (!location) {
		if (!values.hostname) {
			throw new Error('Could not determine hostname from redirect. Pass --hostname explicitly.');
		}

		return { hostname: values.hostname, redirectStatus };
	}

	const targetUrl = new URL(location, values.url);
	return {
		hostname: values.hostname ?? targetUrl.hostname,
		redirectStatus,
		resolvedTargetUrl: targetUrl.toString(),
	};
}

const target = await targetFromInput();
const encodedShort = shortBase64(values.url);
const domainPattern = `^https?://([^/@?#]+@)?([^/?#@]*\\.)?${escapeRegex(target.hostname)}(:[0-9]+)?([/?#]|$)`;
const client = new Client({ connectionString: process.env.DATABASE_URL });
const db = drizzle(client, { schema: Schema });

await client.connect();

try {
	const existing = {
		blockedHostname: await db
			.select({ hostname: Schema.blockedHostnames.hostname })
			.from(Schema.blockedHostnames)
			.where(eq(Schema.blockedHostnames.hostname, target.hostname)),
		domainRows: await db
			.select({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked })
			.from(Schema.urls)
			.where(sql`${Schema.urls.url} ~* ${domainPattern}`)
			.orderBy(desc(Schema.urls.createdAt))
			.limit(25),
		shortRow: encodedShort
			? await db
					.select({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked })
					.from(Schema.urls)
					.where(eq(Schema.urls.shortBase64, encodedShort))
			: [],
		targetRows: target.resolvedTargetUrl
			? await db
					.select({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked })
					.from(Schema.urls)
					.where(eq(Schema.urls.url, target.resolvedTargetUrl))
			: [],
	};

	const result = {
		mode: dryRun ? 'dry-run' : 'apply',
		hostname: target.hostname,
		inputUrl: values.url,
		redirectStatus: target.redirectStatus,
		resolvedTargetUrl: target.resolvedTargetUrl,
		shortBase64: encodedShort,
		existingBlockedHostname: existing.blockedHostname[0] ?? null,
		existingDomainRows: existing.domainRows,
		existingShortRow: existing.shortRow[0] ?? null,
		existingTargetRows: existing.targetRows,
	};

	if (apply) {
		const updated = await db.transaction(async (tx) => {
			const insertedHostname = await tx
				.insert(Schema.blockedHostnames)
				.values({ hostname: target.hostname })
				.onConflictDoNothing()
				.returning({ hostname: Schema.blockedHostnames.hostname });
			const updatedShort = encodedShort
				? await tx
						.update(Schema.urls)
						.set({ blocked: true })
						.where(eq(Schema.urls.shortBase64, encodedShort))
						.returning({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked })
				: [];
			const updatedTarget = target.resolvedTargetUrl
				? await tx
						.update(Schema.urls)
						.set({ blocked: true })
						.where(eq(Schema.urls.url, target.resolvedTargetUrl))
						.returning({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked })
				: [];
			const updatedDomain = await tx
				.update(Schema.urls)
				.set({ blocked: true })
				.where(and(eq(Schema.urls.blocked, false), sql`${Schema.urls.url} ~* ${domainPattern}`))
				.returning({ shortBase64: Schema.urls.shortBase64, url: Schema.urls.url, blocked: Schema.urls.blocked });

			return { insertedHostname, updatedDomain, updatedShort, updatedTarget };
		});

		Object.assign(result, {
			hostnameInserted: updated.insertedHostname.length === 1,
			updatedDomainCount: updated.updatedDomain.length,
			updatedDomainRows: updated.updatedDomain,
			updatedShortCount: updated.updatedShort.length,
			updatedShortRows: updated.updatedShort,
			updatedTargetCount: updated.updatedTarget.length,
			updatedTargetRows: updated.updatedTarget,
		});

		if (process.env.REDIS_URL) {
			const redis = createClient({ url: process.env.REDIS_URL });
			await redis.connect();

			try {
				Object.assign(result, {
					redis: {
						added: await redis.sAdd('blocked-hostnames', [target.hostname]),
						ttlSeconds: 1800,
					},
				});
				await redis.expire('blocked-hostnames', 1800);
			} finally {
				await redis.close();
			}
		}
	}

	console.log(JSON.stringify(result, null, 2));
} finally {
	await client.end();
}

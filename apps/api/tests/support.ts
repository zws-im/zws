import { randomUUID } from 'node:crypto';
import { Test } from '@nestjs/testing';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { inArray, type SQL } from 'drizzle-orm';
import type { RedisClientType } from 'redis';
import { test as baseTest, expect, inject } from 'vitest';
import { z } from 'zod';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/application.js';
import { ConfigService, DEFAULT_SHORT_CHARS } from '../src/config/config.service.js';
import { Schema } from '../src/db/index.js';
import type { Db } from '../src/db/interfaces/db.interface.js';
import { DB_PROVIDER } from '../src/db/providers.js';
import { REDIS_PROVIDER } from '../src/redis/providers.js';
import { SafeBrowsingService } from '../src/safe-browsing/safe-browsing.service.js';
import type { AppRouterType } from '../src/trpc/app.router.js';
import { transformer } from '../src/trpc/transformer.js';

export const websiteUrl = 'https://zws.example';
export const toBase64 = (short: string) => Buffer.from(short).toString('base64');

// oxlint-disable-next-line no-empty-pattern -- Vitest fixtures require a destructured context.
export const test = baseTest.extend('api', async ({}, { onCleanup }) => {
	const hostname = `${randomUUID()}.example`;
	const destination = `https://${hostname}/articles?hello=world#section`;
	const destinations = new Set([destination]);
	const blockedHostnames = new Set<string>();
	const threats = new Set<string>();
	const shortCharacters = [...DEFAULT_SHORT_CHARS];
	const shortRewrites: Record<string, string> = {};
	const module = await Test.createTestingModule({ imports: [AppModule] })
		.overrideProvider(ConfigService)
		.useValue({
			databaseUrl: inject('databaseUrl'),
			redisUrl: inject('redisUrl'),
			websiteUrl,
			shortenedLength: 7,
			characters: shortCharacters,
			shortRewrites,
			version: '3.0.0',
		} satisfies Partial<ConfigService>)
		.overrideProvider(SafeBrowsingService)
		.useValue({
			hasThreatMatches: async (url: URL) => threats.has(url.hostname),
		} satisfies Pick<SafeBrowsingService, 'hasThreatMatches'>)
		.compile();
	const app = module.createNestApplication({ logger: false });
	const redis = app.get<RedisClientType>(REDIS_PROVIDER);
	const db = app.get<Db>(DB_PROVIDER);
	const query = (statement: SQL) => db.execute(statement, 'objects');
	onCleanup(async () => {
		try {
			// Visits cascade when their URL is deleted. Never truncate shared tables or flush Redis.
			await db.delete(Schema.urls).where(inArray(Schema.urls.url, [...destinations]));
			if (blockedHostnames.size) {
				await db
					.delete(Schema.blockedHostnames)
					.where(inArray(Schema.blockedHostnames.hostname, [...blockedHostnames]));
				await redis.sRem('blocked-hostnames', [...blockedHostnames]);
			}
		} finally {
			await Promise.all([app.close(), redis.close()]);
		}
	});
	configureApp(app);
	await app.listen(0, '127.0.0.1');
	const baseUrl = await app.getUrl();
	const trpc = createTRPCClient<AppRouterType>({
		links: [httpBatchLink({ url: `${baseUrl}/trpc`, transformer })],
	});

	async function request(path: string, init?: RequestInit) {
		return fetch(`${baseUrl}${path}`, { ...init, redirect: 'manual', signal: AbortSignal.timeout(10_000) });
	}

	async function shorten(url = destination): Promise<{ short: string; url: string }> {
		destinations.add(url);
		const response = await request('/', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url }),
		});
		expect(response.status, await response.clone().text()).toBe(201);
		return z.object({ short: z.string(), url: z.url() }).parse(await response.json());
	}

	async function stats(short: string): Promise<{ url: string; visits: string[] }> {
		const response = await request(`/${encodeURIComponent(short)}/stats`);
		expect(response.status, await response.clone().text()).toBe(200);
		return z.object({ url: z.url(), visits: z.array(z.iso.datetime()) }).parse(await response.json());
	}

	async function blockHostname(host: string, cached = false) {
		blockedHostnames.add(host);
		if (cached) {
			await redis.sAdd('blocked-hostnames', host);
		} else {
			await db.insert(Schema.blockedHostnames).values({ hostname: host });
		}
	}

	return {
		request,
		shorten,
		stats,
		blockHostname,
		destination,
		hostname,
		threats,
		shortCharacters,
		shortRewrites,
		query,
		redis,
		trpc,
	};
});

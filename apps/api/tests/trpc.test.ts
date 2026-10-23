import { TRPCClientError } from '@trpc/client';
import { describe } from 'vitest';
import { z } from 'zod';
import { test, websiteUrl } from './support.js';

describe('tRPC over HTTP', { tags: ['integration'] }, () => {
	test('shortens through tRPC and shares links and visit stats with REST', async ({ api, expect }) => {
		const shortened = new URL(await api.trpc.urls.shortenUrl.mutate({ url: api.destination }));
		expect(shortened.origin).toBe(websiteUrl);
		const short = decodeURIComponent(shortened.pathname.slice(1));
		expect(await api.trpc.urlStats.getShortUrlStats.query(short)).toStrictEqual({ url: api.destination, visits: [] });
		const visit = await api.request(`/${encodeURIComponent(short)}`);
		expect(visit.status).toBe(308);
		await visit.body?.cancel();
		expect(await api.trpc.urlStats.getShortUrlStats.query(short)).toStrictEqual(await api.stats(short));
		await api.sql`ANALYZE urls, visits`;
		z.object({ urls: z.number().int().min(1), visits: z.number().int().min(1) }).parse(
			await api.trpc.stats.getInstanceStats.query(),
		);
	});

	test('tRPC handles missing links and rejects invalid input', async ({ api, expect }) => {
		expect(await api.trpc.urlStats.getShortUrlStats.query()).toBeNull();
		expect(await api.trpc.urlStats.getShortUrlStats.query(api.hostname)).toBeNull();
		const shortening = api.trpc.urls.shortenUrl.mutate({ url: 'not a URL' });
		await expect(shortening).rejects.toBeInstanceOf(TRPCClientError);
		await expect(shortening).rejects.toMatchObject({ data: { code: 'BAD_REQUEST' } });
	});
});

import { describe } from 'vitest';
import { test, toBase64, websiteUrl } from './support.js';

describe('URL shortening and visits', { tags: ['integration'] }, () => {
	test('persists a zero-width link, resolves it and records each redirect', async ({ api, expect }) => {
		const link = await api.shorten();
		expect(Array.from(link.short).length).toBe(7);
		expect(link.short).toMatch(/^(?:\u200c|\u200d|[\u{e0061}-\u{e007a}]|\u{e007f})+$/u);
		expect(link.url).toBe(new URL(link.short, websiteUrl).href);
		const [row] = await api.sql`SELECT url, blocked FROM urls WHERE short_base64 = ${toBase64(link.short)}`;
		expect(row).toStrictEqual({ url: api.destination, blocked: false });
		expect(await api.stats(link.short)).toStrictEqual({ url: api.destination, visits: [] });

		for (let i = 0; i < 2; i++) {
			const response = await api.request(`/${encodeURIComponent(link.short)}`);
			expect(response.status).toBe(308);
			expect(response.headers.get('location')).toBe(api.destination);
			await response.body?.cancel();
		}
		const visited = await api.stats(link.short);
		expect(visited.url).toBe(api.destination);
		expect(visited.visits.length).toBe(2);
		for (const timestamp of visited.visits) {
			expect(new Date(timestamp).toISOString()).toBe(timestamp);
		}
		expect(visited.visits).toStrictEqual([...visited.visits].sort());
	});

	test('visit=false resolves without redirecting or recording a visit', async ({ api, expect }) => {
		const link = await api.shorten();
		const response = await api.request(`/${encodeURIComponent(link.short)}?visit=false`);
		expect(response.status).toBe(200);
		expect(response.headers.get('location')).toBeNull();
		expect(await response.json()).toStrictEqual({ url: api.destination });
		expect((await api.stats(link.short)).visits).toStrictEqual([]);
	});

	test('rewrites short IDs once for resolution, visit tracking and REST and tRPC stats', async ({ api, expect }) => {
		const alias = `alias-${api.hostname}`;
		const canonical = `canonical-${api.hostname}`;
		api.shortRewrites[alias] = canonical;
		api.shortRewrites[canonical] = 'other';
		await api.sql`INSERT INTO urls (short_base64, url) VALUES (${toBase64(canonical)}, ${api.destination})`;
		const lookup = await api.request(`/${alias}?visit=false`);
		expect(lookup.status).toBe(200);
		expect(await lookup.json()).toStrictEqual({ url: api.destination });

		const visit = await api.request(`/${alias}`);
		expect(visit.status).toBe(308);
		expect(visit.headers.get('location')).toBe(api.destination);
		await visit.body?.cancel();

		const statistics = await api.stats(alias);
		expect(statistics.url).toBe(api.destination);
		expect(statistics.visits.length).toBe(1);
		expect(await api.trpc.urlStats.getShortUrlStats.query(alias)).toStrictEqual(statistics);
	});

	test('rejects invalid bodies without inserting URLs', async ({ api, expect }) => {
		const tooLong = `https://${api.hostname}/${'a'.repeat(500)}`;
		for (const body of [{}, { url: 42 }, { url: 'not a URL' }, { url: tooLong }]) {
			const response = await api.request('/', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
			});
			expect(response.status, await response.text()).toBe(400);
		}
		const [row] = await api.sql`SELECT count(*)::int AS count FROM urls WHERE url = ${tooLong}`;
		expect(row?.['count']).toBe(0);
	});

	test('rejects an invalid visit flag without recording a visit', async ({ api, expect }) => {
		const link = await api.shorten();
		const response = await api.request(`/${encodeURIComponent(link.short)}?visit=invalid`);
		expect(response.status, await response.text()).toBe(400);
		expect((await api.stats(link.short)).visits).toStrictEqual([]);
	});

	test('returns 404 for missing links and their stats', async ({ api, expect }) => {
		for (const path of [`/${api.hostname}`, `/${api.hostname}?visit=false`, `/${api.hostname}/stats`]) {
			const response = await api.request(path);
			expect(response.status, await response.text()).toBe(404);
		}
	});
});

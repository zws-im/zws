import { describe } from 'vitest';
import { test, toBase64 } from './support.js';

describe('URL blocking', { tags: ['integration'] }, () => {
	test('rejects blocked domains and their subdomains from PostgreSQL', async ({ api, expect }) => {
		await api.blockHostname(api.hostname);
		for (const hostname of [api.hostname, `sub.${api.hostname}`]) {
			const response = await api.request('/', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ url: `https://${hostname}/` }),
			});
			expect(response.status, await response.text()).toBe(422);
		}
	});

	test('enforces blocked hostnames cached in Redis', async ({ api, expect }) => {
		await api.blockHostname(api.hostname, true);
		const response = await api.request('/', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url: api.destination }),
		});
		expect(response.status, await response.text()).toBe(422);
	});

	test('rejects a threat reported by Google Safe Browsing', async ({ api, expect }) => {
		api.threats.add(api.hostname);
		const response = await api.request('/', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url: api.destination }),
		});
		expect(response.status, await response.text()).toBe(422);
	});

	test('blocks an existing link after its hostname is blocked', async ({ api, expect }) => {
		const link = await api.shorten();
		await api.blockHostname(api.hostname);
		const response = await api.request(`/${encodeURIComponent(link.short)}`);
		expect(response.status, await response.text()).toBe(410);
		const statistics = await api.request(`/${encodeURIComponent(link.short)}/stats`);
		expect(statistics.status, await statistics.text()).toBe(422);
		const [row] = await api.sql`SELECT blocked FROM urls WHERE short_base64 = ${toBase64(link.short)}`;
		expect(row?.['blocked']).toBe(true);
		const [visits] =
			await api.sql`SELECT count(*)::int AS count FROM visits WHERE url_short_base64 = ${toBase64(link.short)}`;
		expect(visits?.['count']).toBe(0);
	});

	test('enforces a persisted block even when its hostname is allowed', async ({ api, expect }) => {
		const link = await api.shorten();
		await api.sql`UPDATE urls SET blocked = true WHERE short_base64 = ${toBase64(link.short)}`;
		for (const query of ['', '?visit=false']) {
			const response = await api.request(`/${encodeURIComponent(link.short)}${query}`);
			expect(response.status, await response.text()).toBe(410);
		}
		const response = await api.request(`/${encodeURIComponent(link.short)}/stats`);
		expect(response.status, await response.text()).toBe(422);
	});

	test('creates a quarantined link for CAPTCHA phishing without allowing visits', async ({ api, expect }) => {
		const link = await api.shorten(`https://captcha-bot.xyz/verify?test=${api.hostname}`);
		const response = await api.request(`/${encodeURIComponent(link.short)}`);
		expect(response.status, await response.text()).toBe(410);
		const [row] = await api.sql`SELECT blocked FROM urls WHERE short_base64 = ${toBase64(link.short)}`;
		expect(row?.['blocked']).toBe(true);
	});
});

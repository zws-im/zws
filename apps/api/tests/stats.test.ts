import { describe } from 'vitest';
import { z } from 'zod';
import { test } from './support.js';

describe('Instance statistics and badges', { tags: ['integration'] }, () => {
	test('serves instance estimates and Shields badges after PostgreSQL analysis', async ({ api, expect }) => {
		const link = await api.shorten();
		const visit = await api.request(`/${encodeURIComponent(link.short)}`);
		expect(visit.status).toBe(308);
		await visit.body?.cancel();
		await api.sql`ANALYZE urls, visits`;
		const response = await api.request('/stats');
		expect(response.status).toBe(200);
		z.object({ urls: z.number().int().min(1), visits: z.number().int().min(1) }).parse(await response.json());
		for (const label of ['urls', 'visits']) {
			const badge = await api.request(`/stats/shields/${label}`);
			expect(badge.status).toBe(200);
			z.object({
				schemaVersion: z.literal(1),
				color: z.literal('informational'),
				label: z.literal(label),
				message: z.string().regex(/^[1-9][\d,.]*[kMBTQ]?$/),
			}).parse(await badge.json());
		}
		const version = await api.request('/stats/shields/version');
		expect(version.status).toBe(200);
		const badge = z.object({ label: z.literal('version'), message: z.string() }).parse(await version.json());
		expect(badge.message).toMatch(/^v\d+\.\d+\.\d+$/);
	});
});

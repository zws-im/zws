import { describe } from 'vitest';
import { z } from 'zod';
import { test, websiteUrl } from './support.js';

describe('Health and API documentation', { tags: ['integration'] }, () => {
	test('serves health and OpenAPI routes with CORS', async ({ api, expect }) => {
		const health = await api.request('/health', { headers: { origin: websiteUrl } });
		expect(health.status).toBe(200);
		expect(await health.json()).toStrictEqual({ status: 'ok' });
		expect(health.headers.get('access-control-allow-origin')).toBe('*');

		const response = await api.request('/openapi.json');
		expect(response.status).toBe(200);
		const document = z
			.object({ openapi: z.string(), paths: z.record(z.string(), z.record(z.string(), z.unknown())) })
			.parse(await response.json());
		expect(document.openapi).toBe('3.1.1');
		expect(document.paths['/']?.['post']).toBeDefined();
		expect(document.paths['/{short}']?.['get']).toBeDefined();
	});
});

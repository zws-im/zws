import assert from 'node:assert/strict';
import { test } from 'node:test';
import { convertV4MiniflareOptions, Miniflare, Response } from 'miniflare';
import { unstable_readConfig as readConfig } from 'wrangler';

test('built Worker redirects a zero-width short link', { timeout: 30_000 }, async (t) => {
	const config = readConfig({ config: 'wrangler.jsonc' });
	assert.ok(config.assets);
	const shortPath = `/${encodeURIComponent('\u200b'.repeat(7))}`;
	const destination = 'https://example.com/';
	let apiRequests = 0;

	// Execute the deployable bundle in workerd, including OpenNext's manifest patches.
	const worker = new Miniflare(
		convertV4MiniflareOptions({
			modules: true,
			scriptPath: '.open-next/test-worker/worker.js',
			compatibilityDate: config.compatibility_date,
			compatibilityFlags: config.compatibility_flags,
			bindings: config.vars,
			assets: { ...config.assets, routerConfig: { has_user_worker: true } },
			outboundService: async (request) => {
				assert.equal(request.url, `https://api.zws.im${shortPath}`);
				assert.equal(request.method, 'GET');
				apiRequests++;
				return new Response(null, { status: 308, headers: { location: destination } });
			},
			cf: false,
		}),
	);
	t.after(() => worker.dispose());

	const response = await worker.dispatchFetch(`https://zws.im${shortPath}`, { redirect: 'manual' });
	assert.equal(response.status, 307, await response.text());
	assert.equal(response.headers.get('location'), destination);
	assert.equal(apiRequests, 1);
});

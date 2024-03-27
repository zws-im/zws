import { next, rewrite } from '@vercel/edge';
import type { NextRequest } from 'next/server';

const CORS_REQUEST_BASE = {
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
} as const satisfies RequestInit;

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function middleware(request: NextRequest): Response {
	const host = request.headers.get('host');

	if (host === 'api.zws.im') {
		const url = new URL(request.url);

		url.hostname = 'zws.im';
		url.pathname = `/api${url.pathname}`;

		return rewrite(url, CORS_REQUEST_BASE);
	}

	if (request.nextUrl.pathname.startsWith('/api')) {
		return next(CORS_REQUEST_BASE);
	}

	return next();
}

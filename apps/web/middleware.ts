import { next } from '@vercel/edge';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
	throw new TypeError('Missing NEXT_PUBLIC_API_URL env var');
}

const apiUrl = new URL(API_URL);

const API_PATH_PREFIX = '/api/';

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function middleware(request: NextRequest): Response {
	if (request.nextUrl.pathname.startsWith(API_PATH_PREFIX)) {
		// Redirect to API subdomain
		const url = new URL(request.url);

		url.hostname = apiUrl.hostname;
		url.port = apiUrl.port;
		url.pathname = request.nextUrl.pathname.slice(API_PATH_PREFIX.length);

		return next({ headers: { location: url.toString() }, status: 301 });
	}

	return next();
}

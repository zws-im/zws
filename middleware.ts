import { NextRequest, NextResponse } from 'next/server';

const CORS_REQUEST_BASE = {
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
} satisfies RequestInit;

export default async function middleware(request: NextRequest): Promise<NextResponse> {
	const host = request.headers.get('host');

	if (host === 'api.zws.im') {
		const url = new URL(request.url);

		url.hostname = 'zws.im';
		url.pathname = `/api${url.pathname}`;

		return NextResponse.redirect(url, CORS_REQUEST_BASE);
	}

	if (request.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.next(CORS_REQUEST_BASE);
	}

	return NextResponse.next();
}

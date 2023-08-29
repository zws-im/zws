import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest): Promise<NextResponse> {
	const host = request.headers.get('host');

	if (host === 'api.zws.im') {
		const url = new URL(request.url);

		url.hostname = 'zws.im';
		url.pathname = `/api${url.pathname}`;

		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

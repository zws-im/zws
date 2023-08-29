import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest): Promise<NextResponse> {
	// GET requests can be handled like normal
	if (request.method === 'GET') {
		return NextResponse.next();
	}

	// Any other requests (really we just care about POST) should be redirected to the API
	// This is slightly inefficient, ideally we should just proxy the request to the API, but that's not really possible in an edge function
	// The added innefficiency is okay since shortening URLs doesn't need to be super fast
	return NextResponse.redirect(new URL('/api', request.url));
}

export const config = {
	matcher: '/:short',
};

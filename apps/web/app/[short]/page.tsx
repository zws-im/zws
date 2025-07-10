import { notFound, RedirectType, redirect } from 'next/navigation';
import UrlBlockedPage from './url-blocked-page';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
	throw new TypeError('Missing NEXT_PUBLIC_API_URL env var');
}

export const runtime = 'edge';

export default async function UrlSubpathPage(props: {
	params: Promise<{ short: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const [rawSearchParams, rawParams] = await Promise.all([props.searchParams, props.params]);
	const searchParams = new URLSearchParams();

	for (const [key, valueOrValues] of Object.entries(rawSearchParams)) {
		switch (typeof valueOrValues) {
			case 'string':
				searchParams.append(key, valueOrValues);
				break;
			case 'object':
				for (const value of valueOrValues) {
					searchParams.append(key, value);
				}
				break;
			case 'undefined':
				break;
		}
	}

	const rawShort = decodeURIComponent(rawParams.short);

	const request = new Request(`${API_URL}/${rawShort}${searchParams.size > 0 ? '?' : ''}${searchParams}`, {
		redirect: 'manual',
	});
	const response = await fetch(request);

	if (response.status === 404) {
		notFound();
	}

	const redirectTo = response.headers.get('Location');

	if (redirectTo) {
		redirect(redirectTo);
	}

	// Note that an HTTP 300 is not considered "ok"
	if (!response.ok) {
		if (response.status === 410) {
			return <UrlBlockedPage />;
		}

		throw new Error(
			`Unexpected error when sending request to API: ${response.status} ${
				response.statusText
			} - ${await response.text()}`,
		);
	}

	// Return JSON body otherwise
	redirect(`${API_URL}/${encodeURIComponent(rawShort)}?${searchParams}`, RedirectType.replace);
}

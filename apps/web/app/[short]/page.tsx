import assert from 'node:assert/strict';
import { RedirectType } from 'next/dist/client/components/redirect';
import { notFound, redirect } from 'next/navigation';
import UrlBlockedPage from './url-blocked-page';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

assert(API_URL, 'Missing NEXT_PUBLIC_API_URL env var');

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default async function UrlSubpathPage({
	params: rawParams,
	searchParams: rawSearchParams,
}: {
	params: { short: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const searchParams = new URLSearchParams(
		Object.entries(rawSearchParams).flatMap(([key, valueOrValues]) => {
			if (Array.isArray(valueOrValues)) {
				return valueOrValues.map((value) => [key, value]);
			}

			if (valueOrValues === undefined) {
				return [];
			}

			return [[key, valueOrValues]];
		}),
	);

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

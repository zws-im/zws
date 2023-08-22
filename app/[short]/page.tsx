import { RedirectType } from 'next/dist/client/components/redirect';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import * as route from '../api/[short]/route';

export default async function UrlSubpathPage({
	params: rawParams,
	searchParams: rawSearchParams,
}: { params: { short: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
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

	const request = new NextRequest(`http://localhost:3000/api/${rawParams.short}?${searchParams}`, {
		redirect: 'manual',
	});
	const response = await route.GET(request, { params: { short: rawParams.short } });

	if (response.status === 404) {
		notFound();
	}

	if (response.ok) {
		const redirectTo = response.headers.get('Location');

		if (redirectTo) {
			redirect(redirectTo);
		}

		// Return JSON body otherwise
		redirect(`/api/${rawParams.short}?${searchParams}`, RedirectType.replace);
	}

	throw new Error('Unreachable');
}

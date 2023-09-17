import { RedirectType } from 'next/dist/client/components/redirect';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import * as route from '../api/[short]/route';
import { ExceptionCode } from '../api/_lib/exceptions/enums/exceptions.enum';
import { HttpError } from '../swr';
import UrlBlockedPage from './url-blocked-page';

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

	const request = new NextRequest(`http://localhost:3000/api/${rawShort}?${searchParams}`, {
		redirect: 'manual',
	});
	const response = await route.GET(request, { params: { short: rawShort } });

	if (response.status === 404) {
		notFound();
	}

	if (!response.ok) {
		const error = await HttpError.create(response);

		if (error.exception?.code === ExceptionCode.UrlBlocked) {
			return <UrlBlockedPage />;
		} else {
			throw error;
		}
	}

	const redirectTo = response.headers.get('Location');

	if (redirectTo) {
		redirect(redirectTo);
	}

	// Return JSON body otherwise
	redirect(`/api/${encodeURIComponent(rawShort)}?${searchParams}`, RedirectType.replace);
}

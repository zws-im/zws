'use client';

import { ExceptionCode } from '@/app/api/_lib/exceptions/enums/exceptions.enum';
import { UrlStatsSchema } from '@/app/api/_lib/url-stats/dtos/url-stats.dto';
import { HttpError, fetcher } from '@/app/swr';
import { useState } from 'react';
import useSWR from 'swr';
import UrlStatsChart from './url-stats-chart';
import UrlStatsInput from './url-stats-input';

function extractShort(url: string): string | undefined {
	try {
		return new URL(url).pathname.slice(1);
	} catch {
		return undefined;
	}
}

export default function UrlStats() {
	const [url, setUrl] = useState('');
	const short = extractShort(url);

	const {
		data: stats,
		error,
		isLoading,
	} = useSWR<UrlStatsSchema, HttpError>(short ? `/api/${encodeURIComponent(short)}/stats` : undefined, {
		fetcher,
	});

	let errorText = error?.exception?.message ?? error?.message;

	if (error?.exception?.code === ExceptionCode.UrlNotFound) {
		errorText = 'URL not found';
	} else if (error?.exception?.code === ExceptionCode.InvalidPathParams) {
		errorText = 'Invalid URL';
	}

	return (
		<div className='w-full space-y-8'>
			<UrlStatsInput error={errorText} isLoading={isLoading && !stats && !errorText} setShortUrl={setUrl} />

			<div className='max-md:w-full md:w-[36rem]'>
				<UrlStatsChart stats={errorText ? undefined : stats} />
			</div>
		</div>
	);
}

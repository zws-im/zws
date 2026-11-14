'use client';

import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { usePlausible } from '@/app/hooks/plausible';

import { useTRPC } from '@/app/trpc';
import { UrlStatsChart } from './url-stats-chart';
import { UrlStatsInput } from './url-stats-input';

function extractShort(url: string): string | undefined {
	try {
		return decodeURIComponent(new URL(url).pathname).slice(1);
	} catch {
		return undefined;
	}
}

export function UrlStats() {
	const trpc = useTRPC();
	const [url, setUrl] = useState('');
	const short = extractShort(url);
	const plausible = usePlausible();

	const stats = useQuery(trpc.urlStats.getShortUrlStats.queryOptions(short));

	// oxlint-disable-next-line react-hooks/exhaustive-deps -- Intentional
	useEffect(() => {
		if (stats.isSuccess) {
			plausible('Check URL stats');
		}
	}, [stats.isSuccess, short, plausible]);

	return (
		<div className='w-full space-y-8'>
			<UrlStatsInput
				error={short && stats.data === null ? 'URL not found' : stats.error?.message}
				isLoading={stats.isPending}
				setShortUrl={setUrl}
			/>

			<div className='h-48 min-h-max max-lg:h-72 max-md:w-full md:w-[36rem] lg:h-96'>
				<Suspense
					fallback={
						// Prevent layout shift
						<div className='h-full w-full' />
					}
				>
					<UrlStatsChart stats={stats.data ?? undefined} />
				</Suspense>
			</div>
		</div>
	);
}

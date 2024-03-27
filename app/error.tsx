'use client';

import { H } from '@highlight-run/next/client';
import { useEffect } from 'react';
import { Button } from './components/button';
import { H1 } from './components/headings/h1';

const SHOULD_REPORT_ERROR = process.env.NODE_ENV !== 'development';

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function ErrorPage({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		if (SHOULD_REPORT_ERROR) {
			H.consumeError(error);
		}
	}, [error]);

	return (
		<main className='flex flex-col items-center justify-center gap-y-4 max-md:pt-48 max-sm:pt-32 md:pt-72'>
			<H1>An unexpected error occurred</H1>
			<Button onClick={reset}>Try again</Button>
		</main>
	);
}

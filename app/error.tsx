'use client';

import { H } from '@highlight-run/next/client';
import { useEffect } from 'react';
import H1 from './components/headings/h1';
import Button from './components/button';

const SHOULD_REPORT_ERROR = process.env.NODE_ENV !== 'development';

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	if (SHOULD_REPORT_ERROR) {
		// biome-ignore lint/nursery/useHookAtTopLevel: This is safe, since SHOULD_REPORT_ERROR is a constant
		useEffect(() => {
			H.consumeError(error);
		}, [error]);
	}

	return (
		<main className='flex flex-col items-center justify-center gap-y-4 max-sm:mt-32 max-md:mt-48 md:mt-72'>
			<H1>An unexpected error occurred</H1>
			<Button onClick={reset}>Try again</Button>
		</main>
	);
}

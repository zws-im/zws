'use client';

import { H } from '@highlight-run/next/client';
import { useEffect } from 'react';
import { Button } from './components/button';
import { H1 } from './components/headings/h1';

const SHOULD_REPORT_ERROR = process.env.NODE_ENV !== 'development';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		if (SHOULD_REPORT_ERROR) {
			H.consumeError(error);
		}
	}, [error]);

	return (
		<main className='flex flex-col items-center justify-center gap-4 sm:pt-16 md:pt-36'>
			<H1>خطای غیرمنتظره‌ای رخ داد</H1>
			<Button onClick={reset}>تلاش دوباره</Button>
		</main>
	);
}

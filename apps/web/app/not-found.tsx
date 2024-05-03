import { ArrowRightIcon } from '@heroicons/react/20/solid';
import type { Metadata } from 'next';
import { Button } from './components/button';
import { H1 } from './components/headings/h1';
import { siteName } from './shared-metadata';

const title = 'Not Found';
export const metadata: Metadata = {
	title,
	openGraph: {
		siteName,
		title,
	},
};

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function NotFound() {
	return (
		<main className='flex flex-col items-center justify-center gap-4 sm:pt-16 md:pt-36'>
			<H1>404 - Page not found</H1>
			<Button href='/'>
				Home <ArrowRightIcon className='ml-2 h-6 w-6' />
			</Button>
		</main>
	);
}

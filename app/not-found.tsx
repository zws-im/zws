import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Metadata } from 'next';
import Button from './components/button';
import H1 from './components/headings/h1';
import { siteName } from './shared-metadata';

const title = 'Not Found';
export const metadata: Metadata = {
	title,
	openGraph: {
		siteName,
		title,
	},
};

export default function NotFound() {
	return (
		<main className='flex flex-col items-center justify-center space-y-4 max-md:pt-48 max-sm:pt-32 md:pt-72'>
			<H1>404 - Page not found</H1>
			<Button href='/'>
				Home <ArrowRightIcon className='ml-2 h-6 w-6' />
			</Button>
		</main>
	);
}

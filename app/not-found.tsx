import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Metadata } from 'next';
import Link from 'next/link';
import { H1 } from './components';
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
		<main className='flex flex-col items-center justify-center space-y-4 max-sm:mt-32 max-md:mt-48 md:mt-72'>
			<H1>404 - Page not found</H1>
			<Link
				href='/'
				className='w-28 h-full p-4 rounded transition-opacity font-bold flex justify-center items-center bg-zws-purple-500 hover:opacity-90 active:opacity-80'
			>
				Home <ArrowRightIcon className='ml-2 h-6 w-6' />
			</Link>
		</main>
	);
}

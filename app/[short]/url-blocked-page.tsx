import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Button from '../components/button';
import H1 from '../components/headings/h1';

export default function UrlBlockedPage() {
	return (
		<main className='flex flex-col items-center justify-center gap-y-4 max-sm:mt-32 max-md:mt-48 md:mt-72'>
			<H1>That URL is blocked</H1>

			<div className='flex flex-col items-center justify-center gap-y-2'>
				<p>The URL you tried to visit is blocked, and can't be accessed.</p>

				<Button href='/'>
					Home <ArrowRightIcon className='ml-2 h-6 w-6' />
				</Button>
			</div>
		</main>
	);
}

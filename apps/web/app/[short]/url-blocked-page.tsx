import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../components/button';
import { H1 } from '../components/headings/h1';

export default function UrlBlockedPage() {
	return (
		<main className='flex flex-col items-center justify-center gap-y-4 max-md:pt-48 max-sm:pt-32 md:pt-72'>
			<H1>این نشانی مسدود شده است</H1>

			<div className='flex flex-col items-center justify-center gap-y-2'>
				<p>نشانی‌ای که تلاش کردید باز کنید مسدود است و قابل دسترسی نیست.</p>

				<Button href='/'>
					خانه <ArrowRightIcon className='ms-2 h-6 w-6' />
				</Button>
			</div>
		</main>
	);
}

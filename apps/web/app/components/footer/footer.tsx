'use client';

import va from '@vercel/analytics';
import Image from 'next/image';
import { usePlausible } from '@/app/hooks/plausible';
import poweredByVercel from './powered-by-vercel.svg';

export function Footer() {
	const plausible = usePlausible();

	const trackVercelClick = () => {
		va.track('Clicked Vercel badge');
		plausible('Clicked Vercel badge');
	};

	return (
		<footer className='mt-24 flex flex-col items-center gap-4 py-5 text-center'>
			<p className='text-zws-purple-50'>
				<a className='text-zws-purple-400 underline' href='mailto:jonah@jonahsnider.com'>
					تماس
				</a>
			</p>

			<a href='https://vercel.com/?utm_source=jonah-snider&utm_campaign=oss' onClick={trackVercelClick}>
				<Image src={poweredByVercel} alt='قدرت‌گرفته از Vercel' height={32} />
			</a>
		</footer>
	);
}

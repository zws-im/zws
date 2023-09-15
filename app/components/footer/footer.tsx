'use client';

import { usePlausible } from '@/app/hooks/plausible';
import va from '@vercel/analytics';
import Image from 'next/image';
import poweredByVercel from './powered-by-vercel.svg';

export default function Footer() {
	const plausible = usePlausible();

	const trackVercelClick = () => {
		va.track('Clicked Vercel badge');
		plausible('Clicked Vercel badge');
	};

	return (
		<footer className='text-center py-5 mt-24 flex flex-col items-center gap-y-4'>
			<p className='text-zws-purple-50'>
				ZWS is licensed under{' '}
				<a className='underline text-zws-purple-400' href='https://www.apache.org/licenses/LICENSE-2.0'>
					Apache 2.0
				</a>
			</p>

			{/* biome-ignore lint/a11y/useValidAnchor: The click event here is not important for user interaction */}
			<a href='https://vercel.com/?utm_source=zws-im&utm_campaign=oss' onClick={trackVercelClick}>
				<Image src={poweredByVercel} alt='Powered by Vercel' height={32} />
			</a>
		</footer>
	);
}

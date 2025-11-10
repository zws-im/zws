import type { Metadata } from 'next';
import { H1 } from '../components/headings/h1';
import { UrlStats } from '../components/url-stats/url-stats';
import { metadataBase, siteName } from '../shared-metadata';

const description = 'نمایش آمار استفاده برای لینک‌هایی که با zws.im کوتاه کرده‌اید.';
const title = 'آمار';

const canonical = '/stats';
export const metadata: Metadata = {
	metadataBase,
	title,
	description,
	alternates: {
		canonical,
	},
	openGraph: {
		siteName,
		title,
		url: canonical,
		description,
	},
};

export default function StatsPage() {
	return (
		<main>
			<section id='stats' className='flex w-full justify-center'>
				<div className='flex max-w-xl flex-col items-center justify-center gap-8 md:gap-16'>
					<div className='text-center'>
						<H1>آمار</H1>
					</div>

					<div className='w-full'>
						<UrlStats />
					</div>
				</div>
			</section>
		</main>
	);
}

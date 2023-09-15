import { Metadata } from 'next';
import H1 from '../components/headings/h1';
import UrlStats from '../components/url-stats/url-stats';
import { metadataBase, siteName } from '../shared-metadata';

const description = "View usage statistics for URLs you've shortened with zws.im.";
const title = 'Stats';

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
			<section id='stats' className='flex justify-center w-full'>
				<div className='flex flex-col items-center justify-center space-y-16 max-w-xl'>
					<div className='text-center'>
						<H1>Stats</H1>
					</div>

					<div className='w-full'>
						<UrlStats />
					</div>
				</div>
			</section>
		</main>
	);
}

import H1 from '../components/headings/h1';
import UrlStats from '../components/url-stats/url-stats';

export default function StatsPage() {
	return (
		<main>
			<section id='stats' className='flex flex-col items-center justify-center mt-48'>
				<div className='w-full max-w-xl'>
					<div className='mb-16 text-center'>
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

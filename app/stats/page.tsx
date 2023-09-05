import { H1, UrlStats } from '../components';

export default function StatsPage() {
	return (
		<main>
			<section id='stats' className='flex flex-col items-center justify-center'>
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

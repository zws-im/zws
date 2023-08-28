import H1 from '../components/headings/h1';

export default function StatsPage() {
	return (
		<main className='space-y-48'>
			<section id='shorten' className='flex flex-col items-center justify-center mt-96'>
				<div className='max-w-xl'>
					<div className='mb-16 text-center'>
						<H1>Zero Width Shortener</H1>
						<p className='text-[#DCD5F0] text-lg'>
							Shorten your URLs with invisible spaces today. There's no more need for ugly XyGa7z endings.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}

import LightSpot from './components/background-decorations/light-spot';
import DividerLine from './components/divider-line';
import Faq from './components/faq/faq';
import H1 from './components/headings/h1';
import H2 from './components/headings/h2';
import ShortenUrlForm from './components/shorten-url/shorten-url-form';
import Stats from './components/stats/stats';

export default function HomePage() {
	return (
		<main className='max-lg:space-y-16 max-xl:space-y-32 xl:space-y-48'>
			<section id='shorten' className='flex flex-col items-center justify-center max-sm:mt-32 max-md:mt-48 md:mt-72'>
				<div className='max-w-xl'>
					<div className='mb-16 text-center'>
						<H1>Zero Width Shortener</H1>
						<p className='text-[#DCD5F0] text-lg'>
							Shorten your URLs with invisible spaces today. There's no more need for ugly XyGa7z endings.
						</p>
					</div>

					<ShortenUrlForm />
				</div>
			</section>

			<section id='faq' className='flex flex-col lg:items-center'>
				<H2>Frequently Asked Questions</H2>
				<DividerLine />
				<Faq />
			</section>

			<section id='about-us'>
				<LightSpot className='transform max-lg:w-0 max-lg:h-0 max-lg:-translate-x-[200px] xl:translate-x-[200px] 2xl:translate-x-[370px] -translate-y-[145px]' />
				<H2>About us</H2>

				<div className='flex mt-5 max-md:flex-col max-md:space-y-5 md:justify-between md:space-x-20 lg:space-x-40'>
					<div className='flex flex-col space-y-5'>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</p>
						<p>
							Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Adipiscing at in tellus integer
							feugiat. Ultrices tincidunt arcu non sodales neque sodales. Quisque sagittis purus sit amet volutpat
							consequat mauris nunc. A pellentesque sit amet porttitor eget dolor. Tempor orci dapibus ultrices in
							iaculis nunc. At auctor urna nunc id cursus metus aliquam.
						</p>
					</div>

					<Stats />
				</div>
			</section>
		</main>
	);
}

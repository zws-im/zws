import AboutUs from './components/about-us/about-us';
import LightSpot from './components/background-decorations/light-spot';
import DividerLine from './components/divider-line';
import Faq from './components/faq/faq';
import H1 from './components/headings/h1';
import H2 from './components/headings/h2';
import RandomText from './components/random-text';
import ShortenUrlForm from './components/shorten-url/shorten-url-form';

export default function HomePage() {
	return (
		<main className='max-xl:space-y-32 max-lg:space-y-16 xl:space-y-48'>
			<section id='shorten' className='flex flex-col items-center justify-center max-md:pt-24 md:pt-36'>
				<div className='max-w-xl'>
					<div className='text-center'>
						<H1>Zero Width Shortener</H1>

						<p className='text-lg text-zws-purple-100'>
							Shorten URLs with zero width characters, instead of <RandomText length={6} initial='XyGa7z' />.
						</p>

						<div className='pt-16'>
							<ShortenUrlForm />
						</div>
					</div>
				</div>
			</section>

			<section id='faq' className='flex flex-col lg:items-center'>
				<H2>Frequently Asked Questions</H2>
				<DividerLine />
				<Faq />
			</section>

			<section id='about-us'>
				<LightSpot className='-translate-y-[145px] transform max-lg:h-0 max-lg:w-0 max-lg:-translate-x-[200px] xl:translate-x-[200px] 2xl:translate-x-[370px]' />
				<H2>About us</H2>

				<AboutUs />
			</section>
		</main>
	);
}

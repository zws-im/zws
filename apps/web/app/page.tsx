import type { Metadata } from 'next';
import { AboutUs } from './components/about-us/about-us';
import { LightSpot } from './components/background-decorations/light-spot';
import { DividerLine } from './components/divider-line';
import { Faq } from './components/faq/faq';
import { H1 } from './components/headings/h1';
import { H2 } from './components/headings/h2';
import { RandomText } from './components/random-text';
import { ShortenUrlForm } from './components/shorten-url/shorten-url-form';

export const metadata: Metadata = {
	alternates: {
		canonical: '/',
	},
};

export default function HomePage() {
	return (
		<main className='flex flex-col gap-8 md:gap-16 lg:gap-24'>
			<section id='shorten' className='flex flex-col items-center justify-center sm:pt-16 md:pt-36'>
				<div className='max-w-xl'>
					<div className='text-center'>
						<H1>کوتاه‌کنندهٔ لینک با کاراکترهای صفرعرض</H1>

						<p className='text-zws-purple-100 text-lg'>
							لینک‌ها را با کاراکترهای صفرعرض کوتاه کنید؛ به‌جای کاراکترهای معمولی مانند
							<RandomText length={6} initial='XyGa7z' />.
						</p>

						<div className='pt-16'>
							<ShortenUrlForm />
						</div>
					</div>
				</div>
			</section>

			<section id='faq' className='flex flex-col lg:items-center'>
				<H2>سوالات متداول</H2>
				<DividerLine />
				<Faq />
			</section>

			<section id='about-us'>
				<LightSpot className='-translate-y-[145px] transform max-lg:h-0 max-lg:w-0 max-lg:-translate-x-[200px] xl:translate-x-[200px] 2xl:translate-x-[370px]' />
				<H2>درباره ما</H2>

				<AboutUs />
			</section>
		</main>
	);
}


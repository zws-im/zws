import { Variants } from 'framer-motion';
import AboutUs from './components/about-us/about-us';
import LightSpot from './components/background-decorations/light-spot';
import DividerLine from './components/divider-line';
import Faq from './components/faq/faq';
import H1 from './components/headings/h1';
import H2 from './components/headings/h2';
import RandomText from './components/random-text';
import ShortenUrlForm from './components/shorten-url/shorten-url-form';
import * as motion from './motion';

const motionVariants: Variants = {
	visible: {
		opacity: 1,
		y: 0,
	},
	hidden: {
		opacity: 0,
		y: '5%',
	},
};

export default function HomePage() {
	return (
		<main className='max-lg:space-y-16 max-xl:space-y-32 xl:space-y-48'>
			<section id='shorten' className='flex flex-col items-center justify-center max-md:mt-24 md:mt-36'>
				<div className='max-w-xl'>
					<motion.div
						className='text-center'
						initial='hidden'
						animate='visible'
						transition={{
							staggerChildren: 0.15,
						}}
					>
						<motion.div variants={motionVariants}>
							<H1>Zero Width Shortener</H1>
						</motion.div>

						<motion.div variants={motionVariants}>
							<p className='text-zws-purple-100 text-lg'>
								Shorten URLs with zero width characters, instead of <RandomText length={6} initial='XyGa7z' />.
							</p>
						</motion.div>

						<motion.div className='mt-16' variants={motionVariants}>
							<ShortenUrlForm />
						</motion.div>
					</motion.div>
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

				<AboutUs />
			</section>
		</main>
	);
}

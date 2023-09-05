import { Variants } from 'framer-motion';
import { AboutUs, DividerLine, Faq, H1, H2, LightSpot, RandomText, ShortenUrlForm } from './components';
import * as motion from './motion';

const motionVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
};

export default function HomePage() {
	return (
		<motion.main
			className='max-lg:space-y-16 max-xl:space-y-32 xl:space-y-48'
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			variants={motionVariants}
			transition={{
				delayChildren: 1,
				staggerChildren: 0.5,
			}}
		>
			<section id='shorten' className='flex flex-col items-center justify-center max-md:mt-24 md:mt-36'>
				<div className='max-w-xl'>
					<motion.div
						className='text-center'
						initial='hidden'
						animate='visible'
						transition={{
							staggerChildren: 0.4,
							delayChildren: 0,
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

			<motion.section id='faq' className='flex flex-col lg:items-center' variants={motionVariants}>
				<H2>Frequently Asked Questions</H2>
				<DividerLine />
				<Faq />
			</motion.section>

			<motion.section id='about-us' variants={motionVariants}>
				<LightSpot className='transform max-lg:w-0 max-lg:h-0 max-lg:-translate-x-[200px] xl:translate-x-[200px] 2xl:translate-x-[370px] -translate-y-[145px]' />
				<H2>About us</H2>

				<AboutUs />
			</motion.section>
		</motion.main>
	);
}

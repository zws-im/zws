import DividerLine from './components/divider-line';
import Faq from './components/faq/faq';
import H1 from './components/headings/h1';
import H2 from './components/headings/h2';
import ShortenUrlForm from './components/shorten-url/shorten-url-form';

export default function Home() {
	return (
		<main>
			<section id='shorten' className='flex flex-col items-center justify-center h-screen text-center'>
				<div className='max-w-xl'>
					<div className='mb-16'>
						<H1>Zero Width Shortener</H1>
						<p className='text-[#DCD5F0] text-lg'>
							Shorten your URLs with invisible spaces today. There's no more need for ugly XyGa7z endings.
						</p>
					</div>

					<ShortenUrlForm />
				</div>
			</section>

			<section id='faq'>
				<H2>Frequently Asked Questions</H2>
				<DividerLine />
				<Faq />
			</section>

			<section id='about-us'>
				<H2>About us</H2>

				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>
				<p>
					Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Adipiscing at in tellus integer feugiat.
					Ultrices tincidunt arcu non sodales neque sodales. Quisque sagittis purus sit amet volutpat consequat mauris
					nunc. A pellentesque sit amet porttitor eget dolor. Tempor orci dapibus ultrices in iaculis nunc. At auctor
					urna nunc id cursus metus aliquam.
				</p>
			</section>
		</main>
	);
}

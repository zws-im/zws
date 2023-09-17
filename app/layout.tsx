import { HighlightInit } from '@highlight-run/next/client';
import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { Lato } from 'next/font/google';
import DotGrid from './components/background-decorations/dot-grid';
import LightSpot from './components/background-decorations/light-spot';
import Wave from './components/background-decorations/wave';
import Footer from './components/footer/footer';
import Navbar from './components/navbar';
import './globals.css';
import { metadataBase, siteDescription, siteName } from './shared-metadata';

const canonical = '/';

export const metadata: Metadata = {
	metadataBase,
	title: {
		default: siteName,
		absolute: siteName,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	alternates: {
		canonical: canonical,
	},
	openGraph: {
		type: 'website',
		siteName,
		title: siteName,
		url: canonical,
		description: siteDescription,
	},
};

const inter = Lato({ weight: ['400', '700'], subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<HighlightInit
				projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
				tracingOrigins={true}
				excludedHostnames={['localhost']}
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
				}}
			/>

			<html lang='en'>
				<head>
					<PlausibleProvider enabled={true} selfHosted={true} domain='zws.im' />
				</head>
				<body className={clsx(inter.className)}>
					<Wave />

					<div className='min-h-screen'>
						<Navbar />
						<DotGrid height={1} className='left-0 max-xl:top-[550px] max-md:invisible xl:top-[787px]' />
						<DotGrid height={2} className='right-0 top-[145px]' />
						<LightSpot className='-z-50 translate-y-[25px] transform max-2xl:translate-x-[50px] max-md:h-0 max-md:w-0 2xl:translate-x-[300px]' />
						<div className='container mx-auto max-w-screen-xl px-4'>
							{children}
							<Footer />
						</div>
					</div>
					<Analytics />
				</body>
			</html>
		</>
	);
}

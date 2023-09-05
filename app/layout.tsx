import { HighlightInit } from '@highlight-run/next/client';
import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { Lato } from 'next/font/google';
import { DotGrid, Footer, LightSpot, Navbar, Wave } from './components';
import './globals.css';
import { description, metadataBase, siteName } from './shared-metadata';

const inter = Lato({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
	metadataBase,
	title: siteName,
	description,
	openGraph: {
		siteName,
		title: siteName,
		url: 'https://zws.im',
		description,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
						<DotGrid height={1} className='max-xl:top-[550px] xl:top-[787px] left-0 max-md:invisible' />
						<DotGrid height={2} className='top-[145px] right-0' />
						<div className='container mx-auto px-4 max-w-screen-xl'>
							<LightSpot className='transform translate-x-[-250px] translate-y-[-200px] -z-50 max-md:w-0 max-md:h-0' />

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

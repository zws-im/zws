import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import PlausibleProvider from 'next-plausible';
import DotGrid from './components/background-decorations/dot-grid';
import LightSpot from './components/background-decorations/light-spot';
import Wave from './components/background-decorations/wave';
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
		<html lang='en'>
			<head>
				<PlausibleProvider enabled selfHosted domain='zws.im' />
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
	);
}

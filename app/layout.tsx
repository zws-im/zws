import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer';

const inter = Lato({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Navbar />
				<div className='container mx-auto'>{children}</div>
				<Footer />
			</body>
		</html>
	);
}

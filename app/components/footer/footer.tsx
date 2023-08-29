import Image from 'next/image';
import poweredByVercel from './powered-by-vercel.svg';

export default function Footer() {
	return (
		<footer className='text-center py-5 mt-24 flex flex-col items-center space-y-4'>
			<p className='text-zws-purple-50'>
				ZWS is licensed under{' '}
				<a className='underline text-zws-purple-400' href='https://www.apache.org/licenses/LICENSE-2.0'>
					Apache 2.0
				</a>
			</p>
			<a href='https://vercel.com/?utm_source=zws-im&utm_campaign=oss'>
				<Image src={poweredByVercel} alt='Powered by Vercel' className='h-8' />
			</a>
		</footer>
	);
}

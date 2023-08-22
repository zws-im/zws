import Image from 'next/image';
import Link from 'next/link';
import zws from './zws.svg';

export default function NavbarLogo() {
	return (
		<div>
			<Link href='/'>
				<Image src={zws} height={32} className='hover:opacity-80 active:opacity-60 transition-opacity' alt='ZWS' />
			</Link>
		</div>
	);
}

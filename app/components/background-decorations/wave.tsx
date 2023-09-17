import Image from 'next/image';
import wave from './wave.svg';

export default function Wave() {
	return (
		<Image
			priority={true}
			src={wave}
			alt='A wave pattern'
			className='pointer-events-none absolute top-0 z-50 max-h-screen w-screen object-cover'
		/>
	);
}

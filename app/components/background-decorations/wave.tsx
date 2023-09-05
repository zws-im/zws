import Image from 'next/image';
import wave from './wave.svg';

export default function Wave() {
	return (
		<Image
			priority={true}
			src={wave}
			alt='A wave pattern'
			className='absolute top-0 w-screen max-h-screen pointer-events-none z-50 object-cover'
		/>
	);
}

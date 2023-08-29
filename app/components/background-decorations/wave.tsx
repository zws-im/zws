import Image from 'next/image';
import wave from './wave.svg';

export default function Wave() {
	return <Image src={wave} alt='A wave pattern' className='absolute top-0 w-screen pointer-events-none z-50' />;
}

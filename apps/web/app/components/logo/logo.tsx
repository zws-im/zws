import Image from 'next/image';
import zws from './zws.svg';

export function Logo() {
	return <Image src={zws} alt='ZWS' />;
}

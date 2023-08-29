import { PropsWithChildren } from 'react';

export default function H2({ children }: PropsWithChildren) {
	return <h1 className='text-2xl font-bold'>{children}</h1>;
}

import { PropsWithChildren } from 'react';

export default function H1({ children }: PropsWithChildren) {
	return <h1 className='py-6 text-4xl font-bold'>{children}</h1>;
}

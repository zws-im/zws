import { PropsWithChildren } from 'react';

export default function H2({ children }: PropsWithChildren) {
	return <h2 className='text-2xl font-bold'>{children}</h2>;
}

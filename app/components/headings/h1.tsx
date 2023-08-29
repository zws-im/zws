import { PropsWithChildren } from 'react';

export default function H1({ children }: PropsWithChildren) {
	return <h1 className='text-4xl font-bold my-6'>{children}</h1>;
}

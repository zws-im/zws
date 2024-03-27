import type { PropsWithChildren } from 'react';

export function H1({ children }: PropsWithChildren) {
	return <h1 className='py-6 font-bold text-4xl'>{children}</h1>;
}

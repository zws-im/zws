import type { PropsWithChildren } from 'react';

export function H2({ children }: PropsWithChildren) {
	return <h2 className='font-bold text-2xl'>{children}</h2>;
}

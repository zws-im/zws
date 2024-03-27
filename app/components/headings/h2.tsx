import type { PropsWithChildren } from 'react';

export function H2({ children }: PropsWithChildren) {
	return <h2 className='text-2xl font-bold'>{children}</h2>;
}

'use client';

import clsx from 'clsx';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	selected: boolean;
	onClick: () => void;
}>;

export function FaqButton({ onClick, selected, children }: Props) {
	return (
		<div
			className={clsx('h-full transition', {
				'border-l-4 border-zws-purple-400': selected,
				'border-l-2 border-zws-purple-700 pl-0.5': !selected,
			})}
		>
			<button
				type='button'
				className={clsx('py-3 pl-6 text-left', {
					'font-bold': selected,
				})}
				onClick={onClick}
			>
				{children}
			</button>
		</div>
	);
}

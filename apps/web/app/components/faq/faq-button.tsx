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
				'border-zws-purple-400 border-s-4': selected,
				'border-zws-purple-700 border-s-2 ps-0.5': !selected,
			})}
		>
			<button
				type='button'
				className={clsx('py-3 ps-6 text-start', {
					'font-bold': selected,
				})}
				onClick={onClick}
			>
				{children}
			</button>
		</div>
	);
}

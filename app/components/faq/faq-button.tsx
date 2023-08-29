'use client';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	selected: boolean;
	onClick: () => void;
}>;

export default function FaqButton({ onClick, selected, children }: Props) {
	return (
		<div
			className={clsx('transition h-full', {
				'border-zws-purple-400 border-l-4': selected,
				'border-zws-purple-700 border-l-2 pl-0.5': !selected,
			})}
		>
			<button
				type='button'
				className={clsx('py-3 text-left pl-6', {
					'font-bold': selected,
				})}
				onClick={onClick}
			>
				{children}
			</button>
		</div>
	);
}

import clsx from 'clsx';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<
	{
		onClick?: () => void;
	} & (
		| {
				href: string;
				type?: undefined;
		  }
		| {
				href?: undefined;
				type?: 'button' | 'submit' | 'reset';
		  }
	)
>;

export function Button({ children, href, onClick, type }: Props) {
	const className = clsx(
		'w-28 h-full p-4 rounded-sm transition-opacity font-bold flex justify-center items-center bg-zws-purple-500 hover:opacity-90 active:opacity-80',
	);

	if (href) {
		return (
			<Link href={href} onClick={onClick} className={className}>
				{children}
			</Link>
		);
	}

	return (
		<button className={className} onClick={onClick} type={type ?? 'button'}>
			{children}
		</button>
	);
}

import clsx from 'clsx';

type Props = {
	value: string;
	name: string;
	wide?: boolean;
	href?: string;
};

export default function StatsTile({ value, name, wide = false, href }: Props) {
	const tile = (
		<div className='rounded-md h-32 bg-[#301B66] py-6 flex flex-col w-full justify-center items-center'>
			<p
				className={clsx({
					'text-xl max-md:text-3xl': !wide,
					'text-3xl': wide,
				})}
			>
				{value}
			</p>
			<p
				className={clsx('text-[#B69EF6] max-md:text-xl', {
					'text-xl': wide,
				})}
			>
				{name}
			</p>
		</div>
	);

	if (href) {
		return (
			<a
				href={href}
				target='blank'
				rel='noreferrer'
				className='hover:opacity-90 active:opacity-80 transition-opacity w-full'
			>
				{tile}
			</a>
		);
	}

	return tile;
}

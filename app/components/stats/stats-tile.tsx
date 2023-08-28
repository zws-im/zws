import clsx from 'clsx';

type Props = {
	value: string;
	name: string;
	wide?: boolean;
	href?: string;
};

export default function StatsTile({ value, name, wide = false, href }: Props) {
	const containerStyles = clsx('h-32 rounded-md bg-[#301B66] flex flex-col justify-center items-center', {
		'col-span-1 max-md:w-full md:w-32': !wide,
		'col-span-2': wide,
	});

	const tileContents = (
		<>
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
		</>
	);

	if (href) {
		return (
			<a
				href={href}
				target='blank'
				rel='noreferrer'
				className={clsx(containerStyles, 'hover:opacity-90 active:opacity-80 transition-opacity')}
			>
				{tileContents}
			</a>
		);
	}

	return <div className={containerStyles}>{tileContents}</div>;
}

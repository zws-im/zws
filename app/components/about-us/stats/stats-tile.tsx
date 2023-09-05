import clsx from 'clsx';
import { Variants } from 'framer-motion';
import * as motion from '../../../motion';

type Props = {
	value: string;
	name: string;
	wide?: boolean;
	href?: string;
	motionVariants: Variants;
};

export default function StatsTile({ value, name, wide = false, href, motionVariants }: Props) {
	const containerStyles = clsx('h-32 rounded-md bg-zws-purple-800 flex flex-col justify-center items-center', {
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
				className={clsx('text-zws-purple-400 max-md:text-xl', {
					'text-xl': wide,
				})}
			>
				{name}
			</p>
		</>
	);

	if (href) {
		return (
			<motion.a
				href={href}
				target='blank'
				rel='noreferrer'
				className={clsx(containerStyles, 'hover:opacity-90 active:opacity-80 transition-opacity')}
				variants={motionVariants}
			>
				{tileContents}
			</motion.a>
		);
	}

	return (
		<motion.div className={containerStyles} variants={motionVariants}>
			{tileContents}
		</motion.div>
	);
}

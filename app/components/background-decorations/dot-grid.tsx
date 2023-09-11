import clsx from 'clsx';
import Image from 'next/image';
import dots from './dot-grid.svg';

type Props = {
	height: 1 | 2;
	className: string;
};

function SingleDotGrid() {
	return <Image priority={true} src={dots} alt='A grid of dots' />;
}

export default function DotGrid({ height, className }: Props) {
	return (
		<div
			className={clsx(
				'absolute pointer-events-none -z-50',
				{
					'space-y-[7.95px]': height === 2,
				},
				className,
			)}
		>
			<SingleDotGrid />
			{height === 2 && <SingleDotGrid />}
		</div>
	);
}

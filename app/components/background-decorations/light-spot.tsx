import clsx from 'clsx';
import styles from './light-spot.module.css';

type Props = {
	className: string;
};

export default function LightSpot({ className }: Props) {
	return <div className={clsx(styles['light-spot'], 'pointer-events-none absolute h-[630px] w-[1010px]', className)} />;
}

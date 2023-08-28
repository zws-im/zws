import clsx from 'clsx';
import styles from './light-spot.module.css';

type Props = {
	className: string;
};

export default function LightSpot({ className }: Props) {
	return <div className={clsx(styles['light-spot'], 'absolute w-[1010px] h-[630px] pointer-events-none', className)} />;
}

import { StatsTiles } from './stats-tiles';

export function Stats() {
	return (
		<div className='grid min-w-max grid-cols-2 gap-6 max-md:w-full'>
			<StatsTiles />
		</div>
	);
}

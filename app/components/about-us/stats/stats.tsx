import { Suspense } from 'react';
import { StatsTilesActual, StatsTilesFallback } from './stats-tiles';

export default async function Stats() {
	return (
		<div className='min-w-max grid gap-6 grid-cols-2 max-md:w-full'>
			<Suspense fallback={<StatsTilesFallback />}>
				<StatsTilesActual />
			</Suspense>
		</div>
	);
}

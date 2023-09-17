import { Suspense } from 'react';
import { StatsTilesActual, StatsTilesFallback } from './stats-tiles';

export default async function Stats() {
	return (
		<div className='grid min-w-max grid-cols-2 gap-6 max-md:w-full'>
			<Suspense fallback={<StatsTilesFallback />}>
				<StatsTilesActual />
			</Suspense>
		</div>
	);
}

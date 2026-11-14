import { type ComponentProps, Suspense } from 'react';
import { StatsTiles, StatsTilesBase } from './stats-tiles';

export function Stats(props: ComponentProps<typeof StatsTiles>) {
	return (
		<div className='grid min-w-max grid-cols-2 gap-6 max-md:w-full'>
			<Suspense fallback={<StatsTilesBase githubStars={1.8e3} shortenedUrls={7.6e6} visits={15.6e6} />}>
				<StatsTiles {...props} />
			</Suspense>
		</div>
	);
}

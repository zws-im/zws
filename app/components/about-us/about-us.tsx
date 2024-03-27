import { aboutUsContent } from './content';
import { Stats } from './stats/stats';

export function AboutUs() {
	return (
		<div className='flex pt-5 max-md:flex-col md:justify-between lg:space-x-40 md:space-x-20 max-md:space-y-5'>
			<div className='flex flex-col space-y-5'>{aboutUsContent}</div>

			<Stats />
		</div>
	);
}

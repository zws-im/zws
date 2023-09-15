import { aboutUsContent } from './content';
import Stats from './stats/stats';

export default function AboutUs() {
	return (
		<div className='flex pt-5 max-md:flex-col max-md:space-y-5 md:justify-between md:space-x-20 lg:space-x-40'>
			<div className='flex flex-col space-y-5'>{aboutUsContent}</div>

			<Stats />
		</div>
	);
}

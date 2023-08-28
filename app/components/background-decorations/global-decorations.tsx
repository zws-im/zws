import DotGrid from './dot-grid';
import LightSpot from './light-spot';

export default function GlobalDecorations() {
	return (
		<>
			<LightSpot className='transform translate-x-[-250px] translate-y-[-200px] -z-50 max-md:w-0 max-md:h-0' />
			<DotGrid height={1} className='max-xl:top-[550px] xl:top-[787px] left-0 max-md:invisible' />
			<DotGrid height={2} className='top-[145px] right-0' />
		</>
	);
}

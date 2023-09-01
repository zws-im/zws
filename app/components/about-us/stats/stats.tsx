import { statsService } from '@/app/api/_lib/stats/stats.service';
import convert from 'convert';
import millify from 'millify';
import StatsTile from './stats-tile';
import { configService } from '@/app/api/_lib/config/config.service';
import * as motion from '../../../motion';
import { Variants } from 'framer-motion';

async function getGitHubStars(): Promise<number> {
	const query = new URLSearchParams({ q: 'zws-im/zws' });
	const response = await fetch(`https://api.github.com/search/repositories?${query}`, {
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
		next: {
			revalidate: convert(1, 'hour').to('seconds'),
		},
	});

	if (!response.ok) {
		return 0;
	}

	const data = (await response.json()) as {
		items: Array<{
			full_name: string;
			stargazers_count: number;
		}>;
	};

	const zws = data.items.find((item) => item.full_name === 'zws-im/zws');

	return zws?.stargazers_count ?? 0;
}

const motionVariants: Variants = {
	hidden: {
		opacity: 0,
		x: '10%',
	},
	visible: {
		opacity: 1,
		x: 0,
	},
};

export default async function Stats() {
	const [stats, stars] =
		configService.nodeEnv === 'development'
			? [{ visits: 3e6, urls: 2e5 }, 1.5e3]
			: await Promise.all([statsService.getInstanceStats(), getGitHubStars()]);

	return (
		<motion.div
			className='min-w-max grid gap-6 grid-cols-2 max-md:w-full'
			variants={motionVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			transition={{
				delayChildren: 0.2,
				staggerChildren: 0.2,
			}}
		>
			<StatsTile
				wide
				name='URLs shortened'
				value={millify(stats.urls).toLocaleString()}
				motionVariants={motionVariants}
			/>

			<StatsTile name='Visits' value={millify(stats.visits).toLocaleString()} motionVariants={motionVariants} />
			<StatsTile
				name='GitHub stars'
				value={millify(stars).toLocaleString()}
				href='https://github.com/zws-im/zws'
				motionVariants={motionVariants}
			/>
		</motion.div>
	);
}

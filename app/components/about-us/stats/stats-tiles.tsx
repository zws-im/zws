import { statsService } from '@/app/api/_lib/stats/stats.service';
import convert from 'convert';
import millify from 'millify';
import StatsTile from './stats-tile';

async function getGitHubStars(): Promise<number> {
	const query = new URLSearchParams({ q: 'zws-im/zws' });
	const response = await fetch(`https://api.github.com/search/repositories?${query}`, {
		headers: {
			accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
		},
		next: {
			revalidate: convert(24, 'hour').to('seconds'),
		},
	});

	if (!response.ok) {
		return 0;
	}

	const data = (await response.json()) as {
		items: Array<{
			// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
			full_name: string;
			// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
			stargazers_count: number;
		}>;
	};

	const zws = data.items.find((item) => item.full_name === 'zws-im/zws');

	return zws?.stargazers_count ?? 0;
}

type Props = {
	githubStars: number;
	shortenedUrls: number;
	visits: number;
};

function StatsTilesBase({ githubStars, shortenedUrls, visits }: Props) {
	return (
		<>
			<StatsTile wide={true} name='URLs shortened' value={millify(shortenedUrls)} />

			<StatsTile name='Visits' value={millify(visits).toLocaleString()} />
			<StatsTile name='GitHub stars' value={millify(githubStars)} href='https://github.com/zws-im/zws' />
		</>
	);
}

export async function StatsTilesActual() {
	const [stats, stars] = await Promise.all([statsService.getInstanceStats(), getGitHubStars()]);

	return <StatsTilesBase githubStars={stars} shortenedUrls={stats.urls} visits={stats.visits} />;
}

export function StatsTilesFallback() {
	return <StatsTilesBase githubStars={1.5e3} shortenedUrls={2e5} visits={3e6} />;
}

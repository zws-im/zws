import { statsService } from '@/app/api/_lib/stats/stats.service';
import convert from 'convert';
import millify from 'millify';
import StatsTile from './stats-tile';

const GITHUB_STARGAZERS_LINK_HEADER_REGEXP = /^.+,.+page=(?<stars>\d+).+$/;

async function getGitHubStars(): Promise<number> {
	const query = new URLSearchParams({
		// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
		per_page: (1).toString(),
	});
	const response = await fetch(`https://api.github.com/repos/zws-im/zws/stargazers?${query}`, {
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

	const linkHeader = response.headers.get('link');

	return Number(linkHeader?.match(GITHUB_STARGAZERS_LINK_HEADER_REGEXP)?.groups?.stars ?? 0);
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

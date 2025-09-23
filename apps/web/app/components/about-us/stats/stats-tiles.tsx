'use client';

import millify from 'millify';
import { useEffect, useState } from 'react';
import { trpc } from '@/app/trpc';
import { StatsTile } from './stats-tile';

const GITHUB_STARGAZERS_LINK_HEADER_REGEXP = /^.+,.+page=(?<stars>\d+).+$/;

async function getGitHubStars(): Promise<number> {
	const query = new URLSearchParams({
		per_page: (1).toString(),
	});
	const response = await fetch(`https://api.github.com/repos/zws-im/zws/stargazers?${query}`, {
		headers: {
			accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
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

export function StatsTiles() {
	const [stars, setStars] = useState(1.8e3);

	useEffect(() => {
		let isMounted = true;

		getGitHubStars()
			.then((latestStars) => {
				if (!isMounted || !Number.isFinite(latestStars)) {
					return;
				}

				setStars(latestStars);
			})
			.catch(() => {
				// Ignore network errors; the component will keep the fallback value.
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const stats = trpc.stats.getInstanceStats.useQuery(undefined, {
		initialData: {
			urls: 7.6e6,
			visits: 15.6e6,
		},
	});

	return <StatsTilesBase githubStars={stars} shortenedUrls={stats.data.urls} visits={stats.data.visits} />;
}

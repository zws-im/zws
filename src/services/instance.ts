import db from '../db';

interface Stats {
	urls: number;
	visits: number;
}

/**
 * Get statistics for this instance.
 *
 * @returns Statistics for this instance
 */
export async function stats(): Promise<Stats> {
	const [urls, visits] = await db.$transaction([db.shortenedUrl.count(), db.visit.count()]);

	return {urls, visits};
}

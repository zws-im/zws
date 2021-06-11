import millify from 'millify';

import db from '../../../db';

interface Stats {
	urls: number;
	visits: number;
}

/**
 * Get statistics for this instance.
 *
 * @returns Statistics for this instance
 */
export async function instanceStats(): Promise<Stats> {
	const [urls, visits] = await db.$transaction([db.shortenedUrl.count(), db.visit.count()]);

	return {urls, visits};
}

/**
 * Abbreviate a number for displaying in badges.
 *
 * @param number - Number to abbreviate
 *
 * @returns The abbreviated number
 */
export function abbreviateNumber(number: number): string {
	return millify(number);
}

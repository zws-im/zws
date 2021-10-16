import {ApproximateCountKind} from '@prisma/client';
import millify from 'millify';

import db from '../../../db.js';

interface Stats {
	urls: number;
	visits: number;
}

/**
 * Perform an expensive query to get the statistics for this instance.
 * @returns The precise instant stats
 */
export async function savePreciseInstanceStats(): Promise<Stats> {
	const [urls, visits] = await db.$transaction([db.shortenedUrl.count({where: {blocked: false}}), db.visit.count({where: {shortenedUrl: {blocked: false}}})]);

	await db.$transaction([
		db.approximateCounts.upsert({
			where: {kind: ApproximateCountKind.SHORTENED_URLS},
			update: {count: urls},
			create: {kind: ApproximateCountKind.SHORTENED_URLS, count: urls},
		}),
		db.approximateCounts.upsert({
			where: {kind: ApproximateCountKind.VISITS},
			update: {count: visits},
			create: {kind: ApproximateCountKind.VISITS, count: visits},
		}),
	]);

	return {urls, visits};
}

/**
 * Get statistics for this instance.
 *
 * @returns Statistics for this instance
 */
export async function instanceStats(): Promise<Stats> {
	const [urls, visits] = await db.$transaction([
		db.approximateCounts.findUnique({where: {kind: ApproximateCountKind.SHORTENED_URLS}, select: {count: true}}),
		db.approximateCounts.findUnique({where: {kind: ApproximateCountKind.VISITS}, select: {count: true}}),
	]);

	if (urls === null || visits === null) {
		return savePreciseInstanceStats();
	}

	return {urls: urls.count, visits: visits.count};
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

import {multiReplace, sample} from '@jonahsnider/util';
import type {ShortenedUrl} from '@prisma/client';
import PrismaClientPackage from '@prisma/client';
import * as Sentry from '@sentry/node';
import {Buffer} from 'node:buffer';
import type {Opaque} from 'type-fest';
import {characters} from '../../../config/index.js';
import db from '../../../db.js';
import baseLogger from '../../../logger.js';
import {UniqueShortIdTimeout} from '../../errors.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const {ApproximateCountKind} = PrismaClientPackage;

const logger = baseLogger.withTag('services').withTag('urls');
/** Logger for the visits operation. */
const visitLogger = logger.withTag('visit');

/** A short ID. */
export type Short = Opaque<string, 'Short'>;

/** A base64 encoded string. */
type Base64 = Opaque<string, 'Base64'>;

interface Stats {
	url: string;
	visits: Date[];
}

interface VisitUrlData {
	longUrl: string;
	blocked: boolean;
}

/** Maximum number of attempts to generate a unique ID. */
const maxGenerationAttempts = 10;

function encode(value: string): Base64 {
	return Buffer.from(value).toString('base64') as Base64;
}

export function normalizeShortId(id: Short): Short {
	return multiReplace(id, characters.rewrites) as Short;
}

/**
 * Generate a short ID.
 * Not guaranteed to be unique.
 *
 * @returns A short ID
 */
function generateShortId(): Short {
	let shortId = '' as Short;

	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < characters.length; i++) {
		// @ts-expect-error String concatenation forces string type
		shortId += sample(characters.characters) as Short;
	}

	return shortId;
}

/**
 * Visit a shortened URL.
 *
 * @param id - The ID of the shortened URL to visit
 * @param track - If the visit should be tracked
 *
 * @returns The long URL and if it was blocked
 */
export async function visit(id: Short, track: boolean): Promise<VisitUrlData | null> {
	const encodedId = encode(id);

	const shortenedUrl = await db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true, blocked: true}});

	if (shortenedUrl === null) {
		return null;
	}

	if (track && !shortenedUrl.blocked) {
		// Only track URLs if they aren't blocked
		// This is because we know that a blocked URL won't be sent to clients if they are visiting it

		db.$transaction([
			db.visit.create({data: {shortenedUrl: {connect: {shortBase64: encodedId}}}}),
			db.approximateCounts.update({where: {kind: ApproximateCountKind.VISITS}, data: {count: {increment: 1}}}),
		])
			// eslint-disable-next-line promise/prefer-await-to-then
			.catch(error => {
				Sentry.captureException(error);
				visitLogger.error('Failed to create visit', error);
			});
	}

	return {longUrl: shortenedUrl.url, blocked: shortenedUrl.blocked};
}

/**
 * Retrieve usage statistics for a shortened URL
 *
 * @param id - The ID of the shortened URL
 *
 * @returns Shortened URL information and statistics, or `null` if it couldn't be found
 */
export async function stats(id: Short): Promise<null | Stats> {
	const encodedId = encode(id);

	const [visits, shortenedUrl] = await db.$transaction([
		db.visit.findMany({where: {shortenedUrlId: encodedId}, select: {timestamp: true}, orderBy: {timestamp: 'asc'}}),
		db.shortenedUrl.findUnique({where: {shortBase64: encodedId}, select: {url: true}}),
	]);

	if (!shortenedUrl) {
		return null;
	}

	return {visits: visits.map(visit => visit.timestamp), url: shortenedUrl.url};
}

/**
 * Shorten a long URL
 *
 * @param url - The long URL to shorten
 *
 * @returns The ID of the shortened URL
 */
export async function shorten(url: string): Promise<Short> {
	let attempts = 0;
	let created: ShortenedUrl | null = null;
	let id: Short;

	do {
		if (attempts++ > maxGenerationAttempts) {
			throw new UniqueShortIdTimeout(maxGenerationAttempts);
		}

		id = generateShortId();
		const shortBase64 = encode(id);

		try {
			// eslint-disable-next-line no-await-in-loop
			[created] = await db.$transaction([
				db.shortenedUrl.create({data: {url, shortBase64}}),
				db.approximateCounts.update({where: {kind: ApproximateCountKind.SHORTENED_URLS}, data: {count: {increment: 1}}}),
			]);
		} catch {}
	} while (!created);

	return id;
}

import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const shortenedUrls = await db.createCollection('shortenedUrls');
	const visits = await db.createCollection('visits');

	await shortenedUrls.createIndex({ shortBase64: 1 }, { unique: true });
	await visits.createIndex({ id: 1 }, { unique: true });
};
export const down: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	await db.dropCollection('shortenedUrls');
	await db.dropCollection('visits');
};

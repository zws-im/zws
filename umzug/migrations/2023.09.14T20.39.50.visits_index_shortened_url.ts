import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');

	await visits.createIndex('shortenedUrl');
	await visits.createIndex('shortenedUrlBase64');
};
export const down: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');
	await visits.dropIndex('shortenedUrl');
	await visits.dropIndex('shortenedUrlBase64');
};

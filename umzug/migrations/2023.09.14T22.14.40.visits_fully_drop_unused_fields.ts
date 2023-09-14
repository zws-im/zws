import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');

	await visits.updateMany({}, { $unset: { id: '', shortenedUrlBase64: '' } });
};
export const down: MigrationFn<MigrationContext> = async (_params) => {};

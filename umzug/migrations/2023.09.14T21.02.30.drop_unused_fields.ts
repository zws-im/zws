import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');

	if (await visits.indexExists('id_1')) {
		await visits.dropIndex('id_1');
	}
	await visits.updateMany({}, { $unset: { id: '' } });
};
export const down: MigrationFn<MigrationContext> = async (_params) => {};

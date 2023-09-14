import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const shortenedUrls = db.collection('shortenedUrls');
	const visits = db.collection('visits');

	await shortenedUrls.updateMany({ createdAt: { $type: 'string' } }, [
		{ $set: { createdAt: { $dateFromString: { dateString: '$createdAt' } } } },
	]);
	await visits.updateMany({ timestamp: { $type: 'string' } }, [
		{ $set: { timestamp: { $dateFromString: { dateString: '$timestamp' } } } },
	]);
};
export const down: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const shortenedUrls = db.collection('shortenedUrls');
	const visits = db.collection('visits');

	const dateFormat = '%Y-%m-%d %H:%M:%S.%L';

	await shortenedUrls.updateMany({ createdAt: { $type: 'date' } }, [
		{ $set: { createdAt: { $dateToString: { format: dateFormat, date: '$createdAt' } } } },
	]);
	await visits.updateMany({ timestamp: { $type: 'date' } }, [
		{ $set: { timestamp: { $dateToString: { format: dateFormat, date: '$timestamp' } } } },
	]);
};

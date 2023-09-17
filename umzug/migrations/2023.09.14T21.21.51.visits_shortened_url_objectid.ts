import convert from 'convert';
import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');

	const timeout = convert(30, 'minutes').to('ms');
	const cursor = visits.aggregate(
		[
			{
				$match: {
					shortenedUrl: {
						$exists: false,
					},
				},
			},
			{
				$lookup: {
					from: 'shortenedUrls',
					as: 'longUrl',
					let: {
						shortBase64: '$shortenedUrlBase64',
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ['$shortBase64', '$$shortBase64'],
								},
							},
						},
						{
							$project: {
								_id: 1,
							},
						},
					],
				},
			},
			{
				$project: {
					shortenedUrl: {
						$getField: {
							field: '_id',
							input: {
								$first: '$longUrl',
							},
						},
					},
				},
			},
			{
				$merge: {
					into: 'visits',
					on: '_id',
					whenMatched: 'merge',
					whenNotMatched: 'fail',
				},
			},
		],
		// biome-ignore lint/style/useNamingConvention: Can't rename this field
		{ maxTimeMS: timeout, maxAwaitTimeMS: timeout },
	);

	await cursor.maxTimeMS(timeout).addCursorFlag('noCursorTimeout', true).toArray();
};
export const down: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const visits = db.collection('visits');
	visits.updateMany({}, { $unset: { shortenedUrl: 1 } });
};

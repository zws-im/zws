import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import {sum} from '@jonahsnider/util';
import cli from 'cli-ux';
import * as tsj from 'ts-json-schema-generator';
import logger from './logger';

const schemas = {
	responses: ['ShieldsEndpointResponse', 'ApiKeyError', 'ShortenHostnameError'],
	models: [
		'Error',
		'Short',
		'Stats',
		'Url',
		'IncorrectApiKeyError',
		'MissingApiKeyError',
		'UniqueShortIdTimeoutError',
		'AttemptedShortenHostnameError',
		'UrlStats',
		'UrlNotFoundError',
		'NotHealthyError',
		'AttemptedShortenBlockedHostnameError',
		'UrlBlockedError',
	],
	parameters: ['VisitOptions', 'TotalStatsOptions'],
};

const progress = cli.progress() as {stop: () => void; increment: () => void; start: (max: number, start: number) => void};
const promises: Array<Promise<void>> = [];

async function generate(config: tsj.Config) {
	return tsj.createGenerator(config).createSchema(config.type);
}

async function main() {
	for (const [dir, types] of Object.entries(schemas)) {
		for (const type of types) {
			const typeDeclaration = path.join(process.cwd(), 'types', 'schemas', dir, `${type}.d.ts`);
			const config: tsj.Config = {
				type,
				path: typeDeclaration,
				schemaId: `https://zws.im/schemas/${type}.json`,
				topRef: false,
				skipTypeCheck: true,
			};

			progress.increment();
			generate(config)
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(schema => {
					const schemaString = JSON.stringify(schema, null, 2);

					const promise = fs.writeFile(path.join(process.cwd(), 'src', 'schemas', dir, `${type}.json`), schemaString);

					promises.push(promise);
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.catch(error => {
					logger.error(error);
				});
		}
	}

	return Promise.all(promises);
}

progress.start(
	Object.values(schemas)
		.map(x => x.length)
		.reduce(sum),
	0,
);

main()
	.then(() => {
		progress.stop();
	})
	.catch(error => {
		process.nextTick(() => {
			throw error;
		});
	});

import assert from 'node:assert/strict';
import path from 'node:path';
import { MongoClient } from 'mongodb';
import { MongoDBStorage, Umzug } from 'umzug';
import type { MigrationContext } from './types';

const pathToThisFile = path.resolve(import.meta.path);
const dirArg = process.argv[1];

assert(dirArg, 'No directory argument passed to node');

const pathPassedToNode = path.resolve(dirArg);

// biome-ignore lint/complexity/useLiteralKeys: This is a TypeScript rule
assert(process.env['MONGODB_URI'], 'MONGODB_URI is not set');
// biome-ignore lint/complexity/useLiteralKeys: This is a TypeScript rule
const mongo = new MongoClient(process.env['MONGODB_URI']);
await mongo.connect();

export const umzug = new Umzug({
	logger: console,
	migrations: { glob: path.join(import.meta.dir, 'migrations', '*.ts') },
	create: {
		folder: path.join(import.meta.dir, 'migrations'),
	},
	context: (): MigrationContext => {
		return { mongo };
	},
	storage: new MongoDBStorage({ connection: mongo.db('zws') }),
});

if (pathToThisFile.includes(pathPassedToNode)) {
	await umzug.runAsCLI();
}

await mongo.close();

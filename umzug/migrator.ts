import assert from 'assert';
import path from 'path';
import { MongoClient } from 'mongodb';
import { MongoDBStorage, Umzug } from 'umzug';
import { MigrationContext } from './types';

const pathToThisFile = path.resolve(import.meta.path);
const pathPassedToNode = path.resolve(process.argv[1]);

assert(process.env.MONGODB_URI, 'MONGODB_URI is not set');
const mongo = new MongoClient(process.env.MONGODB_URI);
await mongo.connect();

export const umzug = new Umzug({
	logger: console,
	migrations: { glob: path.join(import.meta.dir, 'migrations', '*.ts') },
	create: {
		folder: path.join(import.meta.dir, 'migrations'),
	},
	context: async (): Promise<MigrationContext> => {
		return { mongo };
	},
	storage: new MongoDBStorage({ connection: mongo.db('zws') }),
});

if (pathToThisFile.includes(pathPassedToNode)) {
	await umzug.runAsCLI();
}

await mongo.close();

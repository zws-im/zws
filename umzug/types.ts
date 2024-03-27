import type { MongoClient } from 'mongodb';

export type MigrationContext = {
	mongo: MongoClient;
};

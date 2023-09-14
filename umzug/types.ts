import { MongoClient } from 'mongodb';

export type MigrationContext = {
	mongo: MongoClient;
};

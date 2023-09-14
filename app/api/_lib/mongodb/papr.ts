import { MongoClient } from 'mongodb';
import Papr from 'papr';
import { configService } from '../config/config.service';

const globalForMongo = globalThis as unknown as { mongo: MongoClient };

const client = globalForMongo.mongo || new MongoClient(configService.mongodb.uri);

if (!globalForMongo.mongo) {
	client.connect();
}

if (process.env.NODE_ENV !== 'production') {
	globalForMongo.mongo = client;
}

const db = client.db(configService.mongodb.database);

export const papr = new Papr();
papr.initialize(db);

papr.updateSchemas();

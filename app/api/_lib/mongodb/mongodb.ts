import { MongoClient, OptionalId } from 'mongodb';
import { configService } from '../config/config.service';
import { ShortenedUrl } from './interfaces/shortened-url.interface';
import { Visit } from './interfaces/visit';

const client = new MongoClient(configService.mongodb.uri);

client.connect();

const db = client.db(configService.mongodb.database);

export const mongodb = {
	shortenedUrls: db.collection<OptionalId<ShortenedUrl>>('shortenedUrls'),
	visits: db.collection<OptionalId<Visit>>('visits'),
};

export type Mongodb = typeof mongodb;

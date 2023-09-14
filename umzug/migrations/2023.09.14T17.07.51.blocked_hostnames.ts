import type { MigrationFn } from 'umzug';
import { MigrationContext } from '../types';

export const up: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	const blockedHostnames = await db.createCollection('blockedHostnames');

	await blockedHostnames.createIndex({ hostname: 1 }, { unique: true });
};
export const down: MigrationFn<MigrationContext> = async (params) => {
	const { mongo } = params.context;
	const db = mongo.db('zws');

	await db.dropCollection('blockedHostnames');
};

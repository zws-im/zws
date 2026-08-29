import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { relations } from '../relations.js';

export type Db = PostgresJsDatabase<typeof relations>;

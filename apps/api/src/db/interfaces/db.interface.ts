import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Schema } from '../index';

export type Db = NodePgDatabase<typeof Schema>;

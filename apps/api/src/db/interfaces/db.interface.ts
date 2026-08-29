import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { relations } from '../relations.js';

export type Db = NodePgDatabase<typeof relations>;

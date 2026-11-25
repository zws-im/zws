import type { drizzle } from 'drizzle-orm/postgres';
import type { relations } from '../relations.js';

export type Db = ReturnType<typeof drizzle<typeof relations>>;

import {PrismaClient} from '@prisma/client';
import {dbLogger} from './logger';

const db = new PrismaClient({
	log: [
		{emit: 'event', level: 'error'},
		{emit: 'event', level: 'info'},
		{emit: 'event', level: 'warn'}
	]
});

db.$on('error', error => dbLogger.error(error.message));
db.$on('info', info => dbLogger.info(info.message));
db.$on('warn', warning => dbLogger.warn(warning.message));

export default db;

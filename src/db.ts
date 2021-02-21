import {PrismaClient} from '@prisma/client';
import execa from 'execa';
import baseLogger from './logger';

const logger = baseLogger.getChildLogger({name: 'db'});

export async function applyMigrations(): Promise<void> {
	await execa('yarn', ['run', 'migrations'], {stderr: 'inherit', stdout: 'inherit'});
}

const db = new PrismaClient({
	log: [
		{emit: 'event', level: 'error'},
		{emit: 'event', level: 'info'},
		{emit: 'event', level: 'warn'}
	]
});

db.$on('error', error => logger.error(error.message));
db.$on('info', info => logger.info(info.message));
db.$on('warn', warning => logger.warn(warning.message));

export default db;

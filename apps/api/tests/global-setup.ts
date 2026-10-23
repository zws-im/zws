import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, url } from 'envalid';
import postgres from 'postgres';
import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import type { TestProject } from 'vitest/node';

declare module 'vitest' {
	export interface ProvidedContext {
		databaseUrl: string;
		redisUrl: string;
	}
}

export default async function setup(project: TestProject) {
	const containers: StartedTestContainer[] = [];
	const teardown = async () => {
		await Promise.all(containers.map((container) => container.stop()));
	};

	try {
		let databaseUrl: string;
		let redisUrl: string;
		if (process.env['CI']) {
			// GitHub Actions owns the service containers and their lifecycle.
			const env = cleanEnv(process.env, { TEST_DATABASE_URL: url(), TEST_REDIS_URL: url() });
			databaseUrl = env.TEST_DATABASE_URL;
			redisUrl = env.TEST_REDIS_URL;
		} else {
			// Testcontainers doesn't discover the Docker CLI's active context.
			if (!process.env['DOCKER_HOST']) {
				const { stdout } = await promisify(execFile)('docker', [
					'context',
					'inspect',
					'--format',
					'{{.Endpoints.docker.Host}}',
				]);
				process.env['DOCKER_HOST'] = stdout.trim();
			}
			const db = await new PostgreSqlContainer('postgres:18').start();
			containers.push(db);
			const redis = await new GenericContainer('redis:7.4-alpine')
				.withExposedPorts(6379)
				.withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
				.start();
			containers.push(redis);
			databaseUrl = db.getConnectionUri();
			redisUrl = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
		}

		const sql = postgres(databaseUrl, { max: 1, onnotice: () => {} });
		try {
			await migrate(drizzle({ client: sql }), {
				migrationsFolder: fileURLToPath(new URL('../../../drizzle', import.meta.url)),
			});
		} finally {
			await sql.end({ timeout: 5 });
		}
		project.provide('databaseUrl', databaseUrl);
		project.provide('redisUrl', redisUrl);
		return teardown;
	} catch (error) {
		await teardown();
		throw error;
	}
}

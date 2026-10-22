import { database, defineRailway, github, preserve, project, service, volume } from 'railway/iac';

export default defineRailway((ctx) => {
	if (!ctx.isEnvironment('production')) {
		throw new Error('The zws Railway configuration only supports production.');
	}

	const containers = {
		cpu: 1,
		cpuDescription: '1 vCPU',
		memoryBytes: 1_000_000_000,
		memoryDescription: '1 GB',
		diskBytes: 100_000_000_000,
		diskDescription: '100 GB',
	};
	const postgresContainers = { ...containers, cpu: 2, cpuDescription: '2 vCPU' };

	const redis = database('Redis', 'redis', {
		image: 'railwayapp/redis:7.2.5',
		output: 'REDIS_URL',
		defaultMountPath: '/bitnami',
		region: 'us-west2',
	});
	redis.deploy = {
		multiRegionConfig: { 'us-west2': { numReplicas: 1 } },
		limitOverride: { containers },
	};
	redis.networking = { privateNetworkEndpoint: 'redis' };

	const postgres = database('Postgres', 'postgres', {
		image: 'ghcr.io/railwayapp-templates/postgres-ssl:latest',
		defaultMountPath: '/var/lib/postgresql/data',
		region: 'us-west2',
	});
	postgres.deploy = {
		startCommand: '',
		multiRegionConfig: { 'us-west2': { numReplicas: 1 } },
		limitOverride: { containers: postgresContainers },
	};
	postgres.networking = { privateNetworkEndpoint: 'postgres' };

	const redisData = volume('redis data', {
		alerts: { usage: { '80': {}, '95': {}, '100': {} } },
		allowOnlineResize: true,
		region: 'us-west2',
		sizeMB: 5000,
	});
	const pgdata = volume('pgdata', {
		alerts: { usage: { '80': {}, '95': {}, '100': {} } },
		allowOnlineResize: true,
		region: 'us-west2',
		sizeMB: 50000,
	});

	const api = service('API', {
		source: github('zws-im/zws', { branch: 'main', checkSuites: true }),
		build: {
			buildCommand: 'pnpm turbo run --filter @zws.im/api build',
			buildEnvironment: 'V3',
			builder: 'RAILPACK',
		},
		preDeploy: 'pnpm run migrate',
		start: 'node ./apps/api/dist/main.js',
		healthcheck: '/health',
		healthcheckTimeout: 10,
		replicas: { 'us-west2': 1 },
		deploy: {
			restartPolicyType: 'ALWAYS',
			restartPolicyMaxRetries: 3,
			limitOverride: { containers },
		},
		domains: ['api.zws.im'],
		networking: { privateNetworkEndpoint: 'api' },
		env: {
			DATABASE_URL: postgres.env.DATABASE_URL,
			GOOGLE_API_KEY: preserve(),
			NODE_ENV: 'production',
			REDIS_URL: redis.env.REDIS_URL,
			SENTRY_DSN: 'https://ae4162112afa49b28bd43a0efdf421af@o296607.ingest.us.sentry.io/5700244',
			SHORT_CHARS:
				'["\\u200c","\\u200d","\\udb40\\udc61","\\udb40\\udc62","\\udb40\\udc63","\\udb40\\udc64","\\udb40\\udc65","\\udb40\\udc66","\\udb40\\udc67","\\udb40\\udc68","\\udb40\\udc69","\\udb40\\udc6a","\\udb40\\udc6b","\\udb40\\udc6c","\\udb40\\udc6d","\\udb40\\udc6e","\\udb40\\udc6f","\\udb40\\udc70","\\udb40\\udc71","\\udb40\\udc72","\\udb40\\udc73","\\udb40\\udc74","\\udb40\\udc75","\\udb40\\udc76","\\udb40\\udc77","\\udb40\\udc78","\\udb40\\udc79","\\udb40\\udc7a","\\udb40\\udc7f"]',
			SHORT_LENGTH: '7',
			SHORT_REWRITES: '{"\\u180e": "\\u200c", "\\u200b": "\\u200d"}',
			WEBSITE_URL: 'https://zws.im',
		},
	});

	return project('zws', { resources: [redis, postgres, api, redisData, pgdata] });
});

import { Inject, Injectable } from '@nestjs/common';
import convert from 'convert';
import { inArray } from 'drizzle-orm';
import type { RedisClientType } from 'redis';
import { Schema } from '../db/index';
import type { Db } from '../db/interfaces/db.interface';
import { DB_PROVIDER } from '../db/providers';
import { REDIS_PROVIDER } from '../redis/providers';

type HostnameDomainNamePair = { hostname: string; domainName: string };

@Injectable()
export class BlockedHostnamesService {
	/** The number of seconds to cache private blocked hostnames from the database for. */
	private static readonly BLOCKED_HOSTNAMES_CACHE_DURATION = convert(30, 'min').to('s');

	private static readonly BLOCKED_HOSTNAMES_REDIS_KEY = 'blocked-hostnames';

	/** A regular expression for a domain name. */
	private static readonly DOMAIN_NAME_REG_EXP = /(?:.+\.)?(.+\..+)$/i;

	constructor(
		@Inject(REDIS_PROVIDER) private readonly redis: RedisClientType,
		@Inject(DB_PROVIDER) private readonly db: Db,
	) {}

	async isUrlBlocked(url: Pick<(typeof Schema)['urls']['$inferSelect'], 'blocked' | 'url'>): Promise<boolean> {
		return url.blocked || (await this.isHostnameBlocked(new URL(url.url)));
	}

	async isHostnameBlocked(url: URL): Promise<boolean> {
		const { hostname } = url;
		const domainName = hostname.replace(BlockedHostnamesService.DOMAIN_NAME_REG_EXP, '$1');
		const hostnames = { hostname, domainName };

		const redisResult = await this.redisContainsHostnames(hostnames);

		// Check Redis as a fallback
		if (redisResult) {
			return true;
		}

		// Check database
		if (await this.databaseContainsHostnames(hostnames)) {
			return true;
		}

		if (redisResult === undefined) {
			// Redis cache is missing, so we should populate it
			await this.populateRedisCache();
		}

		// Otherwise, the domain name isn't blocked
		return false;
	}

	private async populateRedisCache(): Promise<void> {
		const hostnames = (
			await this.db
				.select({
					hostname: Schema.blockedHostnames.hostname,
				})
				.from(Schema.blockedHostnames)
		).map((row) => row.hostname);

		if (hostnames.length === 0) {
			return;
		}

		await this.redis.sAdd(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, hostnames);
		await this.redis.expire(
			BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY,
			BlockedHostnamesService.BLOCKED_HOSTNAMES_CACHE_DURATION,
		);
	}

	private async databaseContainsHostnames(hostnames: HostnameDomainNamePair): Promise<boolean> {
		const rows = await this.db
			.select({
				hostname: Schema.blockedHostnames.hostname,
			})
			.from(Schema.blockedHostnames)
			.where(inArray(Schema.blockedHostnames.hostname, [hostnames.hostname, hostnames.domainName]));

		return rows.length > 0;
	}

	/** @returns Whether the hostnames were blocked in Redis, or `undefined` if they were missing. */
	private async redisContainsHostnames(hostnames: HostnameDomainNamePair): Promise<boolean | undefined> {
		const result = await this.redis.smIsMember(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, [
			hostnames.hostname,
			hostnames.domainName,
		]);

		const blockedInCache = result.some((isMember) => isMember);

		if (blockedInCache) {
			return true;
		}

		const redisCacheExists = await this.redis.exists(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY);

		if (redisCacheExists) {
			return false;
		}

		return undefined;
	}
}

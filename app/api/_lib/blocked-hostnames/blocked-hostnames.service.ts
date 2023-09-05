import { PrismaClient } from '@prisma/client';
import { VercelKV, kv } from '@vercel/kv';
import convert from 'convert';
import { ConfigService, configService } from '../config/config.service';
import { prisma } from '../prisma';

export class BlockedHostnamesService {
	/** The number of seconds to cache private blocked hostnames from the database for. */
	private static readonly BLOCKED_HOSTNAMES_CACHE_DURATION = convert(30, 'min').to('s');

	private static readonly BLOCKED_HOSTNAMES_REDIS_KEY = 'blocked-hostnames';

	/** A regular expression for a domain name. */
	private static readonly DOMAIN_NAME_REG_EXP = /(?:.+\.)?(.+\..+)$/i;

	private readonly blockedHostnames = new Set(this.configService.blockedHostnames);

	constructor(
		private readonly kv: VercelKV,
		private readonly prisma: PrismaClient,
		private readonly configService: ConfigService,
	) {}

	async isHostnameBlocked(hostname: string): Promise<boolean> {
		const domainName = hostname.replace(BlockedHostnamesService.DOMAIN_NAME_REG_EXP, '$1');

		// If the hostname is blocked from the config, return true and avoid hitting Redis
		if (this.blockedHostnames.has(hostname) || this.blockedHostnames.has(domainName)) {
			return true;
		}

		// Otherwise, check Redis or the DB
		if (await this.isHostnameBlockedInDb(hostname, domainName)) {
			return true;
		}

		return false;
	}

	private async isHostnameBlockedInDb(hostname: string, domainName: string): Promise<boolean> {
		const result = await this.kv.smismember(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, [
			hostname,
			domainName,
		]);

		const blockedInCache = result.some((count) => count > 0);

		if (!blockedInCache) {
			const redisCacheExists = await this.kv.exists(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY);

			if (redisCacheExists) {
				await this.refreshRedisCache();

				return this.blockedHostnames.has(hostname) || this.blockedHostnames.has(domainName);
			}
		}

		return blockedInCache;
	}

	private async refreshRedisCache(): Promise<void> {
		await this.getBlockedHostnamesFromDatabase();

		await this.kv.sadd(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, this.blockedHostnames);
		await this.kv.expire(
			BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY,
			BlockedHostnamesService.BLOCKED_HOSTNAMES_CACHE_DURATION,
		);
	}

	private async getBlockedHostnamesFromDatabase(): Promise<void> {
		const dbBlockedHostnames = await this.prisma.blockedHostname.findMany({
			select: { hostname: true },
		});

		for (const row of dbBlockedHostnames) {
			this.blockedHostnames.add(row.hostname);
		}
	}
}

export const blockedHostnamesService = new BlockedHostnamesService(kv, prisma, configService);

import { VercelKV, kv } from '@vercel/kv';
import convert from 'convert';
import { ConfigService, configService } from '../config/config.service';
import { BlockedHostnameModel } from '../mongodb/models/blocked-hostname.model';
import { ShortenedUrl } from '../mongodb/models/shortened-url.model';

type HostnameDomainNamePair = { hostname: string; domainName: string };

export class BlockedHostnamesService {
	/** The number of seconds to cache private blocked hostnames from the database for. */
	private static readonly BLOCKED_HOSTNAMES_CACHE_DURATION = convert(30, 'min').to('s');

	private static readonly BLOCKED_HOSTNAMES_REDIS_KEY = 'blocked-hostnames';

	/** A regular expression for a domain name. */
	private static readonly DOMAIN_NAME_REG_EXP = /(?:.+\.)?(.+\..+)$/i;

	private readonly blockedHostnames = new Set(this.configService.blockedHostnames);

	constructor(private readonly kv: VercelKV, private readonly configService: ConfigService) {}

	async isUrlBlocked(url: Pick<ShortenedUrl, 'blocked' | 'url'>): Promise<boolean> {
		return url.blocked || (await this.isHostnameBlocked(new URL(url.url)));
	}

	async isHostnameBlocked(url: URL): Promise<boolean> {
		const { hostname } = url;
		const domainName = hostname.replace(BlockedHostnamesService.DOMAIN_NAME_REG_EXP, '$1');
		const hostnames = { hostname, domainName };

		if (this.cacheContainsHostname(hostnames)) {
			return true;
		}

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
		const hostnamesDocuments = await BlockedHostnameModel.find({}, { projection: { hostname: 1 } });
		const hostnames = hostnamesDocuments.map((document) => document.hostname);

		await this.kv.sadd(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, hostnames);
		await this.kv.expire(
			BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY,
			BlockedHostnamesService.BLOCKED_HOSTNAMES_CACHE_DURATION,
		);
	}

	private async databaseContainsHostnames(hostnames: HostnameDomainNamePair): Promise<boolean> {
		return BlockedHostnameModel.exists({ hostname: { $in: [hostnames.hostname, hostnames.domainName] } });
	}

	/** @returns Whether the hostnames were blocked in Redis, or `undefined` if they were missing. */
	private async redisContainsHostnames(hostnames: HostnameDomainNamePair): Promise<boolean | undefined> {
		const result = await this.kv.smismember(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY, [
			hostnames.hostname,
			hostnames.domainName,
		]);

		const blockedInCache = result.some((count) => count > 0);

		if (blockedInCache) {
			return true;
		}

		const redisCacheExists = await this.kv.exists(BlockedHostnamesService.BLOCKED_HOSTNAMES_REDIS_KEY);

		if (redisCacheExists) {
			return false;
		}

		return undefined;
	}

	private cacheContainsHostname(hostnames: HostnameDomainNamePair): boolean {
		return this.blockedHostnames.has(hostnames.hostname) || this.blockedHostnames.has(hostnames.domainName);
	}
}

export const blockedHostnamesService = new BlockedHostnamesService(kv, configService);

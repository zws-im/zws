import { ApproximateCountKind, PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { Base64, Short } from './interfaces/urls.interface';
import { VisitUrlData } from './interfaces/visit-url-data.interface';
import { BlockedHostnamesService, blockedHostnamesService } from './blocked-hostnames.service';

export class UrlsService {
	static encode(value: string): Base64 {
		return Buffer.from(value).toString('base64') as Base64;
	}

	constructor(
		private readonly prisma: PrismaClient,
		private readonly blockedHostnamesService: BlockedHostnamesService,
	) {}

	/**
	 * Retrieve a shortened URL.
	 *
	 * @param id - The ID of the shortened URL to visit
	 *
	 * @returns The long URL and whether it was blocked
	 */
	async retrieveUrl(id: Short): Promise<VisitUrlData | undefined> {
		const encodedId = UrlsService.encode(id);

		const shortenedUrl = await this.prisma.shortenedUrl.findUnique({
			where: { shortBase64: encodedId },
			select: { url: true, blocked: true },
		});

		if (!shortenedUrl) {
			return undefined;
		}

		if (
			shortenedUrl.blocked ||
			(await this.blockedHostnamesService.isHostnameBlocked(shortenedUrl.url))
		) {
			return {
				longUrl: undefined,
				blocked: true,
			};
		}

		return {
			longUrl: shortenedUrl.url,
			blocked: false,
		};
	}

	/**
	 * Tracks a URL visit.
	 * @param id - The ID of the shortened URL
	 */
	async trackUrlVisit(id: Short): Promise<void> {
		const encodedId = UrlsService.encode(id);

		await this.prisma.$transaction([
			this.prisma.visit.create({
				data: { shortenedUrl: { connect: { shortBase64: encodedId } } },
			}),
			this.prisma.approximateCounts.update({
				where: { kind: ApproximateCountKind.VISITS },
				data: { count: { increment: 1 } },
			}),
		]);
	}
}

export const urlsService = new UrlsService(prisma, blockedHostnamesService);

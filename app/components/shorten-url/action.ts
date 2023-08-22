'use server';

import { Short } from '@/app/api/_lib/urls/interfaces/urls.interface';
import { urlsService } from '@/app/api/_lib/urls/urls.service';

export async function shortenUrlAction(longUrl: string): Promise<{ url: string } | { short: Short }> {
	const shortened = await urlsService.shortenUrl(longUrl);

	return shortened.url ? { url: shortened.url.toString() } : { short: shortened.short };
}

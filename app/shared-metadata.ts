import { configService } from './api/_lib/config/config.service';

export const siteName = 'Zero Width Shortener';

export const metadataBase = configService.shortenedBaseUrl ? new URL(configService.shortenedBaseUrl) : undefined;

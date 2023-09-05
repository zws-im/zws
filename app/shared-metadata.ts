import { configService } from './api/_lib/config/config.service';

export const siteDescription = 'ZWS is a URL shortener which uses zero width characters to shorten URLs.';

export const siteName = 'Zero Width Shortener';

export const metadataBase = configService.shortenedBaseUrl ? new URL(configService.shortenedBaseUrl) : undefined;

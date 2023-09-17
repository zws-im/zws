import { MetadataRoute } from 'next';
import { siteDescription, siteName } from './shared-metadata';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteName,
		// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
		short_name: 'ZWS',
		description: siteDescription,
		// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
		start_url: '/',
		display: 'standalone',
		// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
		background_color: '#140a2e',
		// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
		theme_color: '#ffffff',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
			{
				src: '/opengraph-image.png',
				sizes: 'any',
				type: 'image/png',
			},
		],
	};
}

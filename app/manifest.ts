import { MetadataRoute } from 'next';
import { description, siteName } from './shared-metadata';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteName,
		short_name: 'ZWS',
		description: description,
		start_url: '/',
		display: 'standalone',
		background_color: '#140a2e',
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

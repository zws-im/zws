import { MetadataRoute } from 'next';
import { description, siteName } from './shared-metadata';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteName,
		// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
		short_name: 'ZWS',
		description: description,
		// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
		start_url: '/',
		display: 'standalone',
		// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
		background_color: '#140a2e',
		// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
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

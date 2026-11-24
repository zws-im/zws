import type { NextConfig } from 'next';

export default {
	productionBrowserSourceMaps: true,
	redirects: async () => [
		{
			source: '/docs/api',
			destination: '/api-docs',
			permanent: true,
		},
		{
			source: '/api/:path*',
			destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
			permanent: true,
		},
	],
	allowedDevOrigins: ['zws.im.localhost'],
} satisfies NextConfig;

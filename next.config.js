const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	experimental: {
		serverActions: true,
		instrumentationHook: true,
	},
	env: {
		// biome-ignore lint/style/useNamingConvention: Must use this naming convention for environment variables
		NEXT_PUBLIC_SHORTENED_BASE_URL: process.env.SHORTENED_BASE_URL,
	},
	productionBrowserSourceMaps: true,
	redirects: async () => [
		{
			source: '/docs/api',
			destination: '/api-docs',
			permanent: true,
		},
	],
});

module.exports = nextConfig;

const { withPlausibleProxy } = require('next-plausible');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	env: {
		// biome-ignore lint/style/useNamingConvention: Must use this naming convention for environment variables
		NEXT_PUBLIC_WEBSITE_URL: process.env.WEBSITE_URL,
		// biome-ignore lint/style/useNamingConvention: Must use this naming convention for environment variables
		NEXT_PUBLIC_API_URL: process.env.API_URL,
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

const { withPlausibleProxy } = require('next-plausible');

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	experimental: {
		serverActions: true,
		instrumentationHook: true,
	},
	env: {
		// rome-ignore lint/nursery/useNamingConvention: Must use this naming convention for environment variables
		NEXT_PUBLIC_SHORTENED_BASE_URL: process.env.SHORTENED_BASE_URL,
	},
	productionBrowserSourceMaps: true,
});

module.exports = nextConfig;

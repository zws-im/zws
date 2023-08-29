/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { serverActions: true },
	env: {
		NEXT_PUBLIC_SHORTENED_BASE_URL: process.env.SHORTENED_BASE_URL,
	},
};

module.exports = nextConfig;

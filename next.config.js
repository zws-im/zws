/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: { serverActions: true },
	env: {
		NEXT_PUBLIC_SHORTENED_BASE_URL: process.env.SHORTENED_BASE_URL,
	},
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: '/:path*',
					destination: '/api/:path*',
					has: [
						{
							type: 'host',
							value: 'api.zws.im',
						},
					],
				},
			],
		};
	},
};

module.exports = nextConfig;

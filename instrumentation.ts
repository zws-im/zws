export async function register() {
	if (
		process.env.NODE_ENV === 'development' &&
		process.env.NEXT_RUNTIME === 'nodejs' &&
		process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID
	) {
		const { registerHighlight } = await import('@highlight-run/next/server');

		registerHighlight({
			// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
			projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
		});
	}
}

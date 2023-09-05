export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID) {
		const { registerHighlight } = await import('@highlight-run/next/server');

		registerHighlight({
			// rome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
			projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
		});
	}
}

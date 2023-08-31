export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID) {
		const { registerHighlight } = await import('@highlight-run/next/server');

		registerHighlight({
			projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
		});
	}
}

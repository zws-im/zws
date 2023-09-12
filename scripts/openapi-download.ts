type NextServerState = 'starting' | 'started' | 'stopped';

const OUTPUT_FILE = Bun.file(new URL('../openapi.json', import.meta.url));

class NextServer {
	private currentLog = '';

	// biome-ignore lint/correctness/noUndeclaredVariables: This is a global type
	private processText({ done, value }: ReadableStreamDefaultReadResult<Uint8Array>): NextServerState {
		if (done) {
			return 'stopped';
		}

		const text = new TextDecoder('utf-8').decode(value);

		this.currentLog += text;

		const endOfLine = this.currentLog.indexOf('\n');

		if (endOfLine === -1) {
			return 'starting';
		}

		const line = this.currentLog.slice(0, endOfLine);
		this.currentLog = this.currentLog.slice(endOfLine + 1);

		if (line.includes('ready started server')) {
			return 'started';
		}

		return 'starting';
	}

	private readonly server = Bun.spawn({
		cmd: ['node', 'node_modules/.bin/next', 'start'],
		stdout: 'pipe',
		cwd: new URL('../', import.meta.url).pathname,
		stdin: 'pipe',
	});

	async waitForReady(): Promise<void> {
		// Listen for Next.js ready log from stdout ReadableStream
		const stdout = this.server.stdout.getReader();

		await stdout.read().then(
			// biome-ignore lint/suspicious/noExplicitAny: This is a recursive type which can't easily be expressed
			// biome-ignore lint/correctness/noUndeclaredVariables: This is a global type
			async function xd(this: NextServer, result: ReadableStreamDefaultReadResult<Uint8Array>): Promise<any> {
				const state = this.processText(result);

				if (state === 'starting') {
					this.waitForReady();
				}

				if (state === 'started') {
					return undefined;
				}

				return stdout.read().then(xd);
			}.bind(this),
		);
	}

	async stop(): Promise<void> {
		this.server.kill(1);

		await this.server.exited;
	}
}

const server = new NextServer();

await server.waitForReady();

await fetch('http://localhost:3000/api/openapi.json').then(async (res) => {
	const response = await res.json();

	await Bun.write(OUTPUT_FILE, JSON.stringify(response, null, 2));
});

await server.stop();

process.on('exit', async (): Promise<void> => {
	// In case of crash
	await server.stop();
});

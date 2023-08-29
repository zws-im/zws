import { ExceptionSchema } from './api/_lib/exceptions/dtos/exception.dto';

export class HttpError extends Error {
	static async create(response: Response): Promise<HttpError> {
		const text = await response.text();
		let json: Record<string, unknown> | undefined;
		try {
			json = JSON.parse(text);
		} catch {}

		return new HttpError(json, text, response.status, response.statusText);
	}

	public readonly exception?: ExceptionSchema;

	private constructor(
		public readonly json: Record<string, unknown> | undefined,
		public readonly bodyText: string,
		public readonly statusCode: number,
		public readonly statusText: string,
	) {
		super(`An error occurred while fetching the data: ${statusCode} ${statusText} ${JSON.stringify(json)}`);
		const parsed = ExceptionSchema.safeParse(json);

		if (parsed.success) {
			this.exception = parsed.data;
		}
	}
}

export const fetcher = async (url: string) => {
	const response = await fetch(url);

	if (response.ok) {
		return response.json();
	}

	throw await HttpError.create(response);
};

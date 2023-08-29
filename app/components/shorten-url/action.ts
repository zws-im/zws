'use server';

import { ExceptionSchema } from '@/app/api/_lib/exceptions/dtos/exception.dto';
import { ShortenedUrlSchema } from '@/app/api/_lib/urls/dtos/shortened-url.dto';
import { Short } from '@/app/api/_lib/urls/interfaces/urls.interface';
import * as route from '@/app/api/route';
import { NextRequest } from 'next/server';

export async function shortenUrlAction(longUrl: string): Promise<
	| {
			shortened: { url: string } | { short: Short };
			error: undefined;
	  }
	| { shortened: undefined; error: string }
> {
	const request = new NextRequest('http://localhost:3000/api', {
		body: JSON.stringify({ url: longUrl }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const response = await route.POST(request);

	if (!response.ok) {
		const parsed = ExceptionSchema.safeParse(await response.json());

		if (parsed.success) {
			return {
				shortened: undefined,
				error: parsed.data.message,
			};
		}

		return {
			shortened: undefined,
			error: 'An unknown error occurred',
		};
	}

	const shortened = ShortenedUrlSchema.parse(await response.json());

	return {
		shortened: shortened.url ? { url: shortened.url.toString() } : { short: shortened.short },
		error: undefined,
	};
}

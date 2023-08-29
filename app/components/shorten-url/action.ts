'use server';

import { ShortenedUrlSchema } from '@/app/api/_lib/urls/dtos/shortened-url.dto';
import { Short } from '@/app/api/_lib/urls/interfaces/urls.interface';
import * as route from '@/app/api/route';
import { HttpError } from '@/app/swr';
import { NextRequest } from 'next/server';

export async function shortenUrlAction(longUrl: string): Promise<{ url: string } | { short: Short }> {
	const request = new NextRequest('http://localhost:3000/api', {
		body: JSON.stringify({ url: longUrl }),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const response = await route.POST(request);

	if (!response.ok) {
		throw await HttpError.create(response);
	}

	const shortened = ShortenedUrlSchema.parse(await response.json());

	return shortened.url ? { url: shortened.url.toString() } : { short: shortened.short };
}

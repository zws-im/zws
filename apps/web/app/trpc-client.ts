import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouterType } from '@zws.im/api/src/trpc/app.router';
import { transformer } from '@zws.im/api/src/trpc/transformer';
import getBaseApiUrl from '../shared.js';

export function makeTRPCClient() {
	return createTRPCClient<AppRouterType>({
		links: [httpBatchLink({ transformer, url: new URL('/trpc', getBaseApiUrl()) })],
	});
}

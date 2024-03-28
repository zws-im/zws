import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouterType } from '@zws.im/api/src/trpc/app.router';
import { transformer } from '@zws.im/api/src/trpc/transformer';
import getBaseApiUrl from '../shared.js';

export const trpc = createTRPCNext<AppRouterType>({
	transformer,
	config: () => ({
		links: [
			httpBatchLink({
				transformer,
				url: new URL('/trpc', getBaseApiUrl()),
			}),
		],
	}),
});

export type RouterInput = inferRouterInputs<AppRouterType>;
export type RouterOutput = inferRouterOutputs<AppRouterType>;

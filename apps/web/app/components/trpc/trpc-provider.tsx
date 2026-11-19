'use client';

import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';
import { makeQueryClient } from '@/app/query-client';
import { TRPCProvider } from '@/app/trpc';
import { makeTRPCClient } from '@/app/trpc-client';

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
	if (environmentManager.isServer()) {
		return makeQueryClient();
	}

	browserQueryClient ??= makeQueryClient();
	return browserQueryClient;
}

export function TrpcProvider({ children }: PropsWithChildren) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(makeTRPCClient);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}

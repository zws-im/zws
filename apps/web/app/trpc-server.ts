import 'server-only';

import { createTRPCOptionsProxy, unstable_createHydrateClient } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
import { makeTRPCClient } from './trpc-client';

const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
	client: makeTRPCClient(),
	queryClient: getQueryClient,
});

export const HydrateClient = unstable_createHydrateClient(getQueryClient);

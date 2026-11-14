import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { staleTime: 30_000 },
			dehydrate: {
				shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
				// Let Next.js recognize its dynamic rendering errors.
				shouldRedactErrors: () => false,
			},
		},
	});
}

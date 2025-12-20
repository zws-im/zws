// https://zod.dev/metadata?id=zglobalregistry

declare module 'zod' {
	interface GlobalMeta {
		// add new fields here
		examples?: unknown[];
	}
}

// forces TypeScript to consider the file a module
export {};

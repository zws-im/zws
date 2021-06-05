import {JsonValue} from 'type-fest';
import {z} from 'zod';

const blockedHostnamesSchema = z.array(z.string().min(1)).default([]);
const blockedHostnamesParser = z
	.string()
	.optional()
	.transform(hostnames => (hostnames === undefined ? [] : (JSON.parse(hostnames) as JsonValue)));

/**
 * Hostnames that should be forbidden from being shortened.
 */
export const blockedHostnames: Set<string> = new Set(blockedHostnamesSchema.parse(blockedHostnamesParser.parse(process.env.BLOCKED_HOSTNAMES)));

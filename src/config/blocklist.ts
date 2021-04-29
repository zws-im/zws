import ow from 'ow';
import {JsonValue} from 'type-fest';

const rawBlockedHostnames = process.env.BLOCKED_HOSTNAMES;
const parsedBlockedHostnames = rawBlockedHostnames === undefined ? [] : (JSON.parse(rawBlockedHostnames) as JsonValue);

ow(parsedBlockedHostnames, 'BLOCKED_HOSTNAMES', ow.array.ofType(ow.string));

/**
 * Hostnames that should be forbidden from
 */
export const blockedHostnames: Set<string> = new Set(parsedBlockedHostnames);

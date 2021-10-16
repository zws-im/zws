import type {Static} from '@sinclair/typebox';
import {Type} from '@sinclair/typebox';
import {AttemptedShortenBlockedHostname} from './AttemptedShortenBlockedHostname.js';
import {AttemptedShortenHostname} from './AttemptedShortenHostname.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShortenHostnameError = Type.Union([AttemptedShortenBlockedHostname, AttemptedShortenHostname], {
	description: "The hostname you tried to shorten isn't allowed",
});

export type ShortenHostnameError = Static<typeof ShortenHostnameError>;

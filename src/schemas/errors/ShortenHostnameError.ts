import {Static, Type} from '@sinclair/typebox';
import {AttemptedShortenBlockedHostname} from './AttemptedShortenBlockedHostname';
import {AttemptedShortenHostname} from './AttemptedShortenHostname';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShortenHostnameError = Type.Union([AttemptedShortenBlockedHostname, AttemptedShortenHostname], {
	description: "The hostname you tried to shorten isn't allowed",
});

export type ShortenHostnameError = Static<typeof ShortenHostnameError>;

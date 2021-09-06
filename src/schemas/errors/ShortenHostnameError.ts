import {Static, Type} from '@sinclair/typebox';
import {AttemptedShortenBlockedHostname} from './AttemptedShortenBlockedHostname';
import {AttemptedShortenHostname} from './AttemptedShortenHostname';

export const ShortenHostnameError = Type.Union([AttemptedShortenBlockedHostname, AttemptedShortenHostname], {
	description: "The hostname you tried to shorten isn't allowed",
});

export type ShortenHostnameError = Static<typeof ShortenHostnameError>;

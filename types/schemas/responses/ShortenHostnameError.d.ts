import AttemptedShortenBlockedHostnameError from '../models/AttemptedShortenBlockedHostnameError';
import AttemptedShortenHostnameError from '../models/AttemptedShortenHostnameError';

/**
 * @title ShortenHostnameError
 * @description The hostname you tried to shorten isn't allowed
 */
export type ShortenHostnameError = AttemptedShortenBlockedHostnameError | AttemptedShortenHostnameError;
export default ShortenHostnameError;

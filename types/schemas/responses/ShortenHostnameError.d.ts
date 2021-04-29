import AttempedShortenBlockedHostnameError from '../models/AttempedShortenBlockedHostnameError';
import AttemptedShortenHostnameError from '../models/AttemptedShortenHostnameError';

/**
 * @title ShortenHostnameError
 * @description The hostname you tried to shorten isn't allowed
 */
export type ShortenHostnameError = AttempedShortenBlockedHostnameError | AttemptedShortenHostnameError;
export default ShortenHostnameError;

import IncorrectApiKeyError from '../models/IncorrectApiKeyError';
import MissingApiKeyError from '../models/MissingApiKeyError';

/**
 * @title ApiKeyError
 * @description Something is wrong with the provided API key
 */
export type ApiKeyError = IncorrectApiKeyError | MissingApiKeyError;
export default ApiKeyError;

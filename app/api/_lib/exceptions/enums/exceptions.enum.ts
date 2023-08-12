export enum ExceptionCode {
	InvalidPathParams = 'E_INVALID_PATH_PARAMS',
	InvalidQueryParams = 'E_INVALID_QUERY_PARAMS',
	InvalidBody = 'E_INVALID_BODY',

	UrlNotFound = 'E_URL_NOT_FOUND',
	UrlBlocked = 'E_URL_BLOCKED',

	UniqueShortIdTimeout = 'E_UNIQUE_SHORT_ID_TIMEOUT',
	ShortenBlockedHostname = 'E_SHORTEN_BLOCKED_HOSTNAME',

	MissingPermissions = 'E_MISSING_PERMISSIONS',
	MissingApiKey = 'E_MISSING_API_KEY',
	IncorrectApiKey = 'E_INCORRECT_API_KEY',
}

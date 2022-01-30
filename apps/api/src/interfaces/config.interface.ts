export interface EnvironmentVariables {
	NODE_ENV?: string;

	DATABASE_URL?: string;

	SHORT_LENGTH?: string;
	SHORT_CHARS?: string;
	SHORT_REWRITES?: string;

	PORT?: string;
	API_KEY?: string;
	HOSTNAME?: string;
	SHORTENED_BASE_URL?: string;

	BLOCKED_HOSTNAMES?: string;

	SENTRY_DSN?: string;
}

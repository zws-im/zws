export interface EnvironmentVariables {
	PORT?: string;
	NODE_ENV?: string;

	DATABASE_URL?: string;

	API_KEY?: string;

	HOSTNAME?: string;

	SHORT_LENGTH?: string;
	SHORT_CHARS?: string;
	SHORT_REWRITES?: string;
	SHORTENED_BASE_URL?: string;

	BLOCKED_HOSTNAMES?: string;

	SENTRY_DSN?: string;

	GOOGLE_APPLICATION_CREDENTIALS?: string;
	GOOGLE_PROJECT_ID?: string;
}

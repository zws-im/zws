export enum Env {
	Prod = 'production',
	Dev = 'development',
}

export enum OpenApiTags {
	Urls = 'urls',
	Stats = 'stats',
	Shields = 'shields',
	Health = 'health',
}

export enum OpenApiSecuritySchemeNames {
	ApiKey = 'apiKey',
}

export const SECURED_ROUTE = [{[OpenApiSecuritySchemeNames.ApiKey]: []}];

export enum SentryBreadcrumbCategory {
	Database = 'db',
	Request = 'request',
}

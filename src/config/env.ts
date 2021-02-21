export enum Env {
	Prod,
	Dev
}

/** If the application is running on Heroku. */
export const heroku = 'DYNO' in process.env && process.env.NODE_HOME?.includes('heroku');

export const env = process.env.NODE_ENV === 'development' ? Env.Dev : Env.Prod;

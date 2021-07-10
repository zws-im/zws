export enum Env {
	Prod,
	Dev,
}

export const env = process.env.NODE_ENV === 'development' ? Env.Dev : Env.Prod;

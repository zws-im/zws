import ow from 'ow';
import {JsonValue} from 'type-fest';
import {version} from '../../package.json';

export const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);

const rawHostname: JsonValue = process.env.HOSTNAME ?? 'localhost';

ow(rawHostname, 'HOSTNAME', ow.string);

export const hostname: string = rawHostname;

export const apiKey: string | null = process.env.API_KEY ?? null;

export {version} from '../../package.json';

type UserAgent = `${string}/${string} (${string})`;

export const serverString: UserAgent = `ZWS/${version as '2.0.0'} (+https://zws.im)` as const;

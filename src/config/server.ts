import ow from 'ow';
import {JsonValue} from 'type-fest';

export const port = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);

const rawHostname: JsonValue = process.env.HOSTNAME ?? 'localhost';

ow(rawHostname, 'HOSTNAME', ow.string);

export const hostname: string = rawHostname;

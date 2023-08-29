import { Opaque } from 'type-fest';

/** A short ID. */
export type Short = Opaque<string, 'Short'>;

/** A base64 encoded string. */
export type Base64 = Opaque<string, 'Base64'>;

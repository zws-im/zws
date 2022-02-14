import type {Request} from 'express';

/**
 * An unsafe request, one that has all the type parameters set to use `unknown` instead of `any`.
 *
 * You can optionally provide the type of the response, which defaults to `never` (no response).
 */
export type UnsafeRequest<ResponseType = never> = Request<Record<never, never>, ResponseType, unknown, Record<never, never>>;

import {Static, Type} from '@sinclair/typebox';
import {IncorrectApiKey} from './IncorrectApiKey';
import {MissingApiKey} from './MissingApiKey';

export const ApiKeyError = Type.Union([IncorrectApiKey, MissingApiKey], {
	$id: 'ApiKeyError',
	title: 'ApiKeyError',
	description: 'Something is wrong with the provided API key',
});

export type ApiKeyError = Static<typeof ApiKeyError>;

import type {Static} from '@sinclair/typebox';
import {Type} from '../utils/typebox.js';
import {IncorrectApiKey} from './IncorrectApiKey.js';
import {MissingApiKey} from './MissingApiKey.js';

export const ApiKeyError = Type.Union([IncorrectApiKey, MissingApiKey], {
	$id: 'ApiKeyError',
	title: 'ApiKeyError',
	description: 'Something is wrong with the provided API key',
});

export type ApiKeyError = Static<typeof ApiKeyError>;

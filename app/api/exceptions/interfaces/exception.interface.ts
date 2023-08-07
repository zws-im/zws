import { ExceptionCode } from '../enums/exceptions.enum';

export type ExceptionBody = {
	error: string;
	message: string;
	code: ExceptionCode | undefined;
	statusCode: number;
};

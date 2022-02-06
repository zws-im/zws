import type {Prisma} from '@prisma/client';

/**
 * @see https://github.com/prisma/prisma/issues/6353
 */
interface BuggedPrismaLogEvent {
	timestamp: undefined;
	message: string;
	target: undefined;
}

export class PrismaException extends Error {
	readonly timestamp: Date;
	readonly target: string | undefined;

	constructor(event: Prisma.LogEvent | BuggedPrismaLogEvent) {
		if (event.target === undefined) {
			super(event.message);
		} else {
			super(`${event.target}: ${event.message}`);
		}

		this.name = PrismaException.name;
		this.timestamp = event.timestamp ?? new Date();
		this.target = event.target;
	}
}

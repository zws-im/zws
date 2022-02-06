import type {Prisma} from '@prisma/client';
import type {BuggedPrismaLogEvent} from '../interfaces/bugged-prisma-log-event.interface';

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

/**
 * @see https://github.com/prisma/prisma/issues/6353
 */
export interface BuggedPrismaLogEvent {
	timestamp: undefined;
	message: string;
	target: undefined;
}

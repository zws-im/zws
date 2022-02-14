import {PrismaException} from './prisma.exception';

describe('PrismaException', () => {
	it('should handle valid log events', () => {
		const timestamp = new Date();

		expect(() => {
			throw new PrismaException({
				target: 'target',
				timestamp,
				message: 'message',
			});
		}).toThrowErrorMatchingInlineSnapshot(`"target: message"`);
	});

	it('should handle invalid log events', () => {
		expect(() => {
			throw new PrismaException({
				message: 'message',
				target: undefined,
				timestamp: undefined,
			});
		}).toThrowErrorMatchingInlineSnapshot(`"message"`);
	});
});

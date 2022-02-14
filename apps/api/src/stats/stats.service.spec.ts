import type {TestingModule} from '@nestjs/testing';
import {Test} from '@nestjs/testing';
import type {Prisma} from '@prisma/client';
import {ApproximateCountKind} from '@prisma/client';
import {PrismaService} from '../prisma/prisma.service';
import type {Stats} from './interfaces/stats.interface';
import {StatsService} from './stats.service';

describe('StatsService', () => {
	describe('savePreciseInstanceStats', () => {
		type MockPrismaService = ReturnType<typeof createMockPrismaService>;

		function createMockPrismaService() {
			return {
				$transaction: jest.fn(async (args: unknown[]) => Promise.all(args)),
				shortenedUrl: {
					count: jest.fn().mockResolvedValue(100),
				},
				visit: {
					count: jest.fn().mockResolvedValue(200),
				},
				approximateCounts: {
					upsert: jest.fn().mockResolvedValue(undefined),
				},
			};
		}

		let service: StatsService;
		let mockPrismaService: MockPrismaService;

		beforeEach(async () => {
			const module: TestingModule = await Test.createTestingModule({
				providers: [
					StatsService,
					{
						provide: PrismaService,
						useValue: createMockPrismaService(),
					},
				],
			}).compile();

			service = module.get<StatsService>(StatsService);
			mockPrismaService = module.get<MockPrismaService>(PrismaService as any);
		});

		it('should get the accurate counts and then upserted approximate counts', async () => {
			// eslint-disable-next-line @typescript-eslint/dot-notation
			const actual = await service['savePreciseInstanceStats']();

			expect(actual).toStrictEqual<Stats>({urls: 100, visits: 200});

			expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(2);

			expect(mockPrismaService.shortenedUrl.count.mock.calls).toEqual([[{where: {blocked: false}}]]);
			expect(mockPrismaService.visit.count.mock.calls).toEqual([[{where: {shortenedUrl: {blocked: false}}}]]);

			expect(mockPrismaService.approximateCounts.upsert.mock.calls).toEqual([
				[
					{
						where: {kind: ApproximateCountKind.SHORTENED_URLS},
						update: {count: 100},
						create: {kind: ApproximateCountKind.SHORTENED_URLS, count: 100},
					},
				],
				[
					{
						where: {kind: ApproximateCountKind.VISITS},
						update: {count: 200},
						create: {kind: ApproximateCountKind.VISITS, count: 200},
					},
				],
			]);
		});
	});

	describe('instanceStats', () => {
		it('returns approximate counts when available', async () => {
			type MockPrismaService = ReturnType<typeof createMockPrismaService>;

			function createMockPrismaService() {
				return {
					$transaction: jest.fn(async (args: unknown[]) => Promise.all(args)),
					shortenedUrl: {
						count: jest.fn().mockResolvedValue(100),
					},
					visit: {
						count: jest.fn().mockResolvedValue(200),
					},
					approximateCounts: {
						findUnique: jest.fn().mockImplementation(async (args: Prisma.ApproximateCountsFindUniqueArgs): Promise<{count: number}> => {
							if (args.where.kind === ApproximateCountKind.SHORTENED_URLS) {
								return {count: 300};
							}

							if (args.where.kind === ApproximateCountKind.VISITS) {
								return {count: 400};
							}

							throw new RangeError('Unexpected kind');
						}),
					},
				};
			}

			const module: TestingModule = await Test.createTestingModule({
				providers: [
					StatsService,
					{
						provide: PrismaService,
						useValue: createMockPrismaService(),
					},
				],
			}).compile();

			const service: StatsService = module.get<StatsService>(StatsService);
			const mockPrismaService: MockPrismaService = module.get<MockPrismaService>(PrismaService as any);

			const actual = await service.instanceStats();

			expect(actual).toStrictEqual<Stats>({urls: 300, visits: 400});

			expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);

			expect(mockPrismaService.approximateCounts.findUnique.mock.calls).toEqual([
				[{where: {kind: ApproximateCountKind.SHORTENED_URLS}, select: {count: true}}],
				[{where: {kind: ApproximateCountKind.VISITS}, select: {count: true}}],
			]);
		});

		it('falls back to savePreciseInstanceStats when approximate counts are unavailable', async () => {
			type MockPrismaService = ReturnType<typeof createMockPrismaService>;

			function createMockPrismaService() {
				return {
					$transaction: jest.fn(async (args: unknown[]) => Promise.all(args)),
					approximateCounts: {
						findUnique: jest.fn().mockResolvedValue(null),
					},
				};
			}

			const module: TestingModule = await Test.createTestingModule({
				providers: [
					StatsService,
					{
						provide: PrismaService,
						useValue: createMockPrismaService(),
					},
				],
			}).compile();

			const service: StatsService = module.get<StatsService>(StatsService);
			const mockPrismaService: MockPrismaService = module.get<MockPrismaService>(PrismaService as any);

			const spy = jest.spyOn(service, 'savePreciseInstanceStats' as keyof StatsService).mockResolvedValue({urls: 100, visits: 200});

			const actual = await service.instanceStats();

			expect(actual).toStrictEqual<Stats>({urls: 100, visits: 200});

			expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);

			expect(mockPrismaService.approximateCounts.findUnique.mock.calls).toEqual([
				[{where: {kind: ApproximateCountKind.SHORTENED_URLS}, select: {count: true}}],
				[{where: {kind: ApproximateCountKind.VISITS}, select: {count: true}}],
			]);

			expect(spy).toHaveBeenCalledTimes(1);
		});
	});
});

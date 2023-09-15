import { ShortenedUrlModel } from '../mongodb/models/shortened-url.model';
import { VisitModel } from '../mongodb/models/visit.model';

import { StatsSchema } from './dtos/stats.dto';

export class StatsService {
	async getInstanceStats(): Promise<StatsSchema> {
		const [urls, visits] = await Promise.all([
			ShortenedUrlModel.collection.estimatedDocumentCount(),
			VisitModel.collection.estimatedDocumentCount(),
		]);

		return { urls, visits };
	}
}

export const statsService = new StatsService();

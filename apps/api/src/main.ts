import './instrument.js';
import { createApp } from './application.js';
import { ConfigService } from './config/config.service.js';

const app = await createApp();
await app.listen(app.get(ConfigService).port);

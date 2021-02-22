import supportsColor from 'supports-color';
import {Logger} from 'tslog';
import {heroku} from './config/env';

const logger = new Logger({
	displayFilePath: 'hidden',
	displayFunctionName: false,
	colorizePrettyLogs: supportsColor.stdout && supportsColor.stderr,
	// Heroku logs display timestamps next to each line
	displayDateTime: !heroku
});

export const fastifyLogger = logger.getChildLogger({name: 'http'});
export const configLogger = logger.getChildLogger({name: 'config'});
export const dbLogger = logger.getChildLogger({name: 'db'});

export default logger;

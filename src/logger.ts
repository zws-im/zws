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

export default logger;

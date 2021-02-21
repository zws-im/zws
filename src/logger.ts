import {Logger} from 'tslog';
import supportsColor from 'supports-color';

const logger = new Logger({displayFilePath: 'hidden', displayFunctionName: false, colorizePrettyLogs: supportsColor.stdout && supportsColor.stderr});

export default logger;

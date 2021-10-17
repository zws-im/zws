import {Env} from '../utils.js';

export default function parse(processEnv: NodeJS.ProcessEnv) {
	const env = processEnv.NODE_ENV === 'development' ? Env.Dev : Env.Prod;

	return {env};
}

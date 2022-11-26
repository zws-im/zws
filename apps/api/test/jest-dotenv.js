/* eslint-disable unicorn/prefer-module */

const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '..', '..', '..', '.env'),
});

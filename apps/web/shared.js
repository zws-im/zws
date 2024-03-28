/**
 * @returns {string}
 */
function getBaseApiUrl() {
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}

	if (process.env.API_URL) {
		return process.env.API_URL;
	}

	return 'http://localhost:3001';
}

module.exports = getBaseApiUrl;

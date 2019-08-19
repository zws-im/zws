const mergeDefault = require("./mergeDefault");

/**
 * Helper function for URL stats.
 * @param {Object} data
 */
module.exports = data => {
  mergeDefault({
    stats: {
      shorten: 0,
      get: 0
    },
    usage: {
      shorten: [],
      get: []
    }
  }, data);

  return {
    shorten: data.stats.shorten,
    get: data.stats.get,
    usage: {
      get: data.usage.get.map(firestoreTimestamp =>
        firestoreTimestamp.toMillis()
      ),
      shorten: data.usage.shorten.map(firestoreTimestamp =>
        firestoreTimestamp.toMillis()
      )
    }
  };
};

/**
 * Sets default properties on an object that aren't already specified.
 * @param {Object} def Default properties
 * @param {Object} given Object to assign defaults to
 * @returns {Object}
 */
module.exports = (def, given) => {
  if (!given) return def;
  for (const key in def) {
    if (!Object.prototype.hasOwnProperty.call(given, key) || given[key] === undefined) {
      given[key] = def[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = module.exports(def[key], given[key]);
    }
  }

  return given;
};

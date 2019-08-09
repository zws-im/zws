const { characters } = require("../constants");

/**
 * Convert binary numbers to zero-width spaces
 * @param {number} binary Binary values to convert
 */
module.exports = binary => {
  let string = Number(binary).toString();

  characters.forEach(
    (spaceConfig, index) => (string = string.replace(new RegExp(index.toString(), "g"), spaceConfig.preferred))
  );

  return string;
};

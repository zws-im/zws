const { characters } = require("../constants");

/**
 * Convert binary numbers in string form to zero-width spaces
 * @param {string} binaryString Binary values to convert
 */
module.exports = binaryString => {
  characters.forEach(
    (spaceConfig, index) =>
      (binaryString = binaryString.replace(new RegExp(index.toString(), "g"), spaceConfig.preferred))
  );

  return binaryString;
};

const { characters } = require("../constants");

/**
 * Replace space characters with binary code IDs.
 * @param {string} spaceCharacters String with space characters in it to be replaced with binary
 */
module.exports = spaceCharacters => {
  characters.forEach(
    (spaceConfig, index) =>
      (spaceCharacters = spaceCharacters.replace(
        new RegExp(`${spaceConfig.compatible.join("|")}|${spaceConfig.preferred}`, "g"),
        index
      ))
  );

  return spaceCharacters;
};

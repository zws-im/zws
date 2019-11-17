/**
 * @typedef {Object} CharacterConfig Configuration object for a specific type of short character.
 * @property {string} preferred The preferred character to use for this type of character
 * @property {Array<string>} [compatible] Array of compatible other compatible characters, not including the preferred character
 */

/**
 * Space characters that are used in shortened URLs.
 * @enum {CharacterConfig} Array of character configs, array index is their numerical ID
 */
module.exports.characters = [
  {
    preferred: "\u200c",
    compatible: ["\u180e"]
  },
  {
    preferred: "\u200d",
    compatible: ["\u200b"]
  }
];

/**
 * Hostnames of ZWS instances.
 * Used to prevent shortening a link that's already shortened.
 */
module.exports.hostnames = [
  "zws.im",
  "zero-width-shortener.firebaseapp.com",
  "zero-width-shortener.web.app",
  "zws.jonahsnider.ninja",
  "zws.jonah.pw",
  "zerowidthshortener.netlify.com"
];

/**
 * RegEx for space characters.
 */
module.exports.spacesRegex = new RegExp(
  `^(${module.exports.characters
    .map(spaceConfig => `${spaceConfig.preferred}|${spaceConfig.compatible.join("|")}`)
    .join("|")})+$`
);

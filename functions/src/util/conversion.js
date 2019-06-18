const spaces = require("./spaces");

exports.binaryToSpaces = binary =>
  Number(binary)
    // Convert to string
    .toString()
    // Replace zeroes with spaces
    .replace(/0/g, spaces[0])
    // Replace ones with spaces
    .replace(/1/g, spaces[1]);

exports.spacesToBinary = spacesString =>
  spacesString
    // Convert one type of space to zeroes
    .replace(new RegExp(spacesString[0], "g"), "0")
    // Convert the other type of space to ones
    .replace(new RegExp(spacesString[1], "g"), "1");

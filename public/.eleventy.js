module.exports = eleventyConfig => {
  // Assets
  eleventyConfig.addPassthroughCopy("assets");

  // Keybase verification
  eleventyConfig.addPassthroughCopy("keybase.txt");

  return { dir: { output: "build" } };
};

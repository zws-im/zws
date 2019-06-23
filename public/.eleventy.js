module.exports = eleventyConfig => {
  // Assets
  eleventyConfig.addPassthroughCopy("assets");

  // Keybase verification
  eleventyConfig.addPassthroughCopy("keybase.txt");

  // Service worker
  eleventyConfig.addPassthroughCopy("sw.js");

  return { dir: { output: "build" } };
};

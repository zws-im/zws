module.exports = eleventyConfig => {
  // Images folder
  eleventyConfig.addPassthroughCopy("image");

  // Assets
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("styles.css");

  // Web manifest
  eleventyConfig.addPassthroughCopy("manifest.json");

  // Keybase verification
  eleventyConfig.addPassthroughCopy("keybase.txt");

  return { dir: { output: "build" } };
};

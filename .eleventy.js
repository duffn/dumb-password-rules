const esbuild = require("esbuild");
const htmlmin = require("html-minifier");
const md = require("markdown-it")();
const Image = require("@11ty/eleventy-img");
const fs = require("fs");

async function imageShortcode(
  src,
  cls,
  alt,
  widths = [600],
  outputDir = "./_site/static/thumbnails/",
  urlPath = "/static/thumbnails/",
  sizes = "(min-width: 30em) 50vw, 100vw"
) {
  let metadata = await Image(src, {
    widths,
    formats: ["jpeg", "webp"],
    outputDir,
    urlPath,
  });

  let imageAttributes = {
    class: cls,
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.on("eleventy.before", async function () {
    await esbuild.build({
      minify: true,
      entryPoints: ["src/static/js/index.js"],
      bundle: true,
      outfile: "_site/static/js/bundle.js",
      sourcemap: false,
      target: ["es2017"],
    });
  });

  eleventyConfig.addPassthroughCopy("src/static/img");
  eleventyConfig.addPassthroughCopy("src/screenshots");

  eleventyConfig.addAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter("markdownIt", function (value) {
    return md.render(value);
  });

  eleventyConfig.addFilter("bustCache", (url) => {
    const buildEpoch = Date.now();
    return `${url}?${buildEpoch}`;
  });

  eleventyConfig.addTransform("htmlmin", function (content) {
    if (
      process.env.ELEVENTY_ENV === "production" &&
      this.page.outputPath &&
      this.page.outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: "src",
    },
  };
};

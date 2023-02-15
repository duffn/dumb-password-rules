const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

module.exports = function () {
  const sitesPath = path.resolve(__dirname, "sites");
  return fs
    .readdirSync(sitesPath)
    .map((file) => {
      return yaml.load(fs.readFileSync(path.resolve(sitesPath, file), "utf8"));
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));
};

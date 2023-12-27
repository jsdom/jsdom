"use strict";

module.exports = {
  jsdom: require("./jsdom"),
  dom: require("./dom"),
  html: require("./html"),
  selectors: require("./selectors")
};

require("./prepare-suites")("", module.exports);

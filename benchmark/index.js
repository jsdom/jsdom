"use strict";

module.exports = {
  jsdom: require("./jsdom"),
  dom: require("./dom"),
  html: require("./html"),
  selectors: require("./selectors"),
  style: require("./style")
};

require("./prepare-suites")("", module.exports);

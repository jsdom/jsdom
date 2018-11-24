"use strict";

module.exports = {
  jsdom: require("./jsdom"),
  dom: require("./dom"),
  html: require("./html")
};

require("./prepare-suites")("", module.exports);

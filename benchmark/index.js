"use strict";

module.exports = {
  jsdom: require("./jsdom"),
  dom: require("./dom")
};

require("./prepare-suites")("", module.exports);

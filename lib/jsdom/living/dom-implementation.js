"use strict";

const DOMImplementation = require("./generated/DOMImplementation");

module.exports = function (core) {
  core.DOMImplementation = DOMImplementation.interface;
};

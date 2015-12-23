"use strict";
const ProcessingInstruction = require("./generated/ProcessingInstruction").interface;

module.exports = function (core) {
  core.ProcessingInstruction = ProcessingInstruction;
};

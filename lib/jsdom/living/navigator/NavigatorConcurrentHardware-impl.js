"use strict";
const os = require("node:os");

exports.implementation = class NavigatorConcurrentHardwareImpl {
  get hardwareConcurrency() {
    return os.cpus().length;
  }
};

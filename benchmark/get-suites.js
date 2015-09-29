"use strict";

module.exports = function getSuites(obj) {
  if (typeof obj.run === "function") {
    // a single suite
    return [obj];
  }

  let ret = [];
  // sort() to ensure consistent order in which benchmarks execute
  for (const name of Object.keys(obj).sort()) {
    ret = ret.concat(module.exports(obj[name]));
  }

  return ret;
};

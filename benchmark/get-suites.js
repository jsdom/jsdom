"use strict";

module.exports = function getSuites(obj) {
  if (typeof obj.run === "function") {
    // a single suite
    return [obj];
  }

  let ret = [];
  // sort() to ensure consistent order in which benchmarks execute
  Object.keys(obj).sort().forEach(function (name) {
    ret = ret.concat(module.exports(obj[name]));
  });

  return ret;
};

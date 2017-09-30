"use strict";

const getSuites = require("./get-suites");

module.exports = function pathToSuites(benchmarks, paths) {
  let ret = [];
  if (paths && paths.length) {
    // dom/construction/createElement => benchmarks.dom.construction.createElement
    for (const path of paths) {
      const parts = path.split(/[/\\]/);
      let suites = benchmarks;

      for (const part of parts) {
        suites = Object.prototype.hasOwnProperty.call(suites, part) && suites[part];
        if (!suites) {
          throw Error("Invalid suite: '" + path + "'");
        }
      }

      ret = ret.concat(getSuites(suites));
    }
  } else {
    ret = ret.concat(getSuites(benchmarks));
  }

  return ret;
};

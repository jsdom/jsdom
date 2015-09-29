"use strict";
/* eslint-disable no-console */
/* eslint-disable no-invalid-this */

function onError(event) {
  const bench = event.target;
  console.error("Error in benchmark", bench.name, ":", bench.error);
}

function onStart() {
  console.log("# " + this.name + " #");
}

function onCycle(event) {
  console.log(String(event.target));
}

function onComplete() {
  if (this.length > 1) {
    const fastest = this.filter("fastest")[0];
    const slowest = this.filter("slowest")[0];
    if (fastest) {
      const relativeDiff = slowest && Math.round(slowest.stats.mean / fastest.stats.mean * 100) / 100;
      console.info("Fastest is \"" +
                   fastest.name.trim() +
                   "\", which is " +
                   relativeDiff +
                   "x faster than the slowest \"" +
                   slowest.name +
                   "\"");
    }
  }

  console.log("");
}

module.exports = function consoleReporter(suite) {
  suite.off("error", onError);
  suite.off("start", onStart);
  suite.off("cycle", onCycle);
  suite.off("complete", onComplete);
  suite.on("error", onError);
  suite.on("start", onStart);
  suite.on("cycle", onCycle);
  suite.on("complete", onComplete);
  return suite;
};

"use strict";

const { JSDOM } = require("../../../lib/api");
const { window } = new JSDOM("");

function registerTimerWithClosure() {
  const hugeArray = Array(10000000)
    .fill(0)
    .map((_, idx) => idx);

  window.setTimeout(() => hugeArray, 1);
}

global.gc();
const { heapTotal : heapTotalBeforeTimer } = process.memoryUsage();
registerTimerWithClosure();
global.gc();

setTimeout(() => {
  global.gc();
  const { heapTotal : heapTotalAfterTimer } = process.memoryUsage();
  console.log(heapTotalAfterTimer - heapTotalBeforeTimer);
}, 10);

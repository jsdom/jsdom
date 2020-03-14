"use strict";

const { JSDOM } = require("../../..");
const { window } = new JSDOM();

function registerTimerWithClosure() {
  const hugeArray = Array(10000000)
    .fill(0)
    .map((_, idx) => idx);

  window.setTimeout(() => hugeArray, 1);
}

global.gc();
const heapTotalBeforeTimer = process.memoryUsage().heapTotal;
registerTimerWithClosure();
global.gc();

setTimeout(() => {
  global.gc();
  const heapTotalAfterTimer = process.memoryUsage().heapTotal;
  console.log(heapTotalAfterTimer - heapTotalBeforeTimer);
}, 10);

"use strict";

const { JSDOM } = require("../../..");
const { window } = new JSDOM("");

function registerTimerWithClosure() {
  const hugeArray = Array(5000000)
    .fill(0)
    .map((_, idx) => idx);

  window.setTimeout(() => hugeArray, 100);
}

global.gc();
const headTotalBeforeTimer = process.memoryUsage().heapTotal;
registerTimerWithClosure();
global.gc();

setTimeout(() => {
  global.gc();
  const headTotalAfterTimer = process.memoryUsage().heapTotal;
  // eslint-disable-next-line no-console
  console.log(`${Math.floor((headTotalAfterTimer - headTotalBeforeTimer) / 1024 / 1024)}`);
}, 1000);

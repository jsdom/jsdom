"use strict";

const { JSDOM } = require("../../..");
const { window } = new JSDOM();

function registerTimerWithClosure() {
  const hugeArray = Array(2**25)
    .fill(0)
    .map((_, idx) => idx);

  window.setTimeout(() => hugeArray, 1);
}

global.gc();
const heapTotalBeforeTimer = process.memoryUsage().heapTotal;
registerTimerWithClosure();
const heapTotalAfterRegister = process.memoryUsage().heapTotal;
global.gc();

setTimeout(() => {
  global.gc();
  const heapTotalAfterTimer = process.memoryUsage().heapTotal;

  // In previous revisions of this test we were checking heapTotalAfterTimer - heapTotalBeforeTimer. That ends up being
  // fragile as due to other overhead the value can change between Node.js versions.
  //
  // Instead, we want to check that we are much closer to heapTotalBeforeTimer than we are to heapTotalAfterRegister.
  console.log((heapTotalAfterTimer - heapTotalBeforeTimer) / (heapTotalAfterRegister - heapTotalBeforeTimer));
}, 10);

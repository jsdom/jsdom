"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { window } = new JSDOM();
  let target = window.document.createElement("div");

  const targetRef = new WeakRef(target);
  const observer = new window.MutationObserver(() => {});
  observer.observe(target, { attributes: true });
  target = undefined;

  let collected = false;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (targetRef.deref() === undefined) {
      collected = true;
      break;
    }
  }

  // Keep the observer reachable throughout the test.
  assert.deepEqual(observer.takeRecords(), []);
  console.log(collected ? "collected" : "retained");
})();

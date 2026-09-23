"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

const windows = [];

function createAndClose() {
  const { window } = new JSDOM("<style>#root { color: orange; }</style><div id=root></div>");
  windows.push(new WeakRef(window));
  window.close();
}

(async () => {
  for (let i = 0; i < 10; ++i) {
    createAndClose();
  }

  let allCollected = false;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (windows.every(ref => ref.deref() === undefined)) {
      allCollected = true;
      break;
    }
  }

  const aliveIndices = windows.flatMap((ref, i) => (ref.deref() === undefined ? [] : [i]));
  assert.deepEqual(aliveIndices, []);
  console.log(allCollected ? "collected" : "retained");
})();

// Regression test for https://github.com/jsdom/jsdom/issues/4338
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM } from "../../../lib/api.js";

function createAndClose() {
  const { window } = new JSDOM("<body>test</body>");
  assert.equal(window.getComputedStyle(window.document.body).display, "block");
  const ref = new WeakRef(window);
  window.close();
  return ref;
}

const windows = [];
for (let i = 0; i < 10; ++i) {
  windows.push(createAndClose());
}

for (let i = 0; i < 10; ++i) {
  await setImmediate();
  global.gc();
  if (windows.every(ref => ref.deref() === undefined)) {
    break;
  }
}

assert.deepEqual(windows.flatMap((ref, i) => ref.deref() === undefined ? [] : [i]), []);
console.log("collected");

"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { document } = new JSDOM().window;
  const parent = document.body.appendChild(document.createElement("div"));
  let child = parent.appendChild(document.createElement("span"));

  // Materialize both live collections before removing their shared child.
  assert.equal(parent.childNodes.length, 1);
  assert.equal(parent.children.length, 1);

  const childRef = new WeakRef(child);
  parent.removeChild(child);
  child = undefined;

  let collected = false;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (childRef.deref() === undefined) {
      collected = true;
      break;
    }
  }

  // Keep the parent and its cached live collections reachable throughout the test.
  assert.equal(parent.isConnected, true);
  console.log(collected ? "collected" : "retained");
})();

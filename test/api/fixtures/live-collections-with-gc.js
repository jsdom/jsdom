"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { document } = new JSDOM().window;
  const parent = document.body.appendChild(document.createElement("div"));
  let child = parent.appendChild(document.createElement("span"));
  child.setAttribute("data-testid", "child");

  // Materialize live collections and selector results before removing their shared child.
  assert.equal(parent.childNodes.length, 1);
  assert.equal(parent.children.length, 1);
  assert.equal(parent.querySelectorAll("[data-testid]").length, 1);
  assert.equal(parent.querySelectorAll("[data-testid]").length, 1);
  assert.equal(document.querySelectorAll("[data-testid]").length, 1);

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

  // Keep the parent and its caches reachable throughout the test, without another query after removal.
  assert.equal(parent.isConnected, true);
  console.log(collected ? "collected" : "retained");
})();

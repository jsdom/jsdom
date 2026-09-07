"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { window } = new JSDOM("", { url: "https://example.com/" });
  let frame = window.document.createElement("iframe");
  window.document.body.append(frame);

  let frameWindow = frame.contentWindow;
  const frameWindowRef = new WeakRef(frameWindow);

  frame.remove();
  frame = undefined;
  frameWindow = undefined;

  let collected = false;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (frameWindowRef.deref() === undefined) {
      collected = true;
      break;
    }
  }

  // Keep the parent window reachable throughout the test.
  assert.equal(window.document.defaultView, window);
  console.log(collected ? "collected" : "retained");
})();

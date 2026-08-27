"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { window } = new JSDOM();
  const controller = new window.AbortController();
  let manuallyRemovedTarget = new window.EventTarget();
  let onceTarget = new window.EventTarget();

  const manuallyRemovedTargetRef = new WeakRef(manuallyRemovedTarget);
  const onceTargetRef = new WeakRef(onceTarget);
  function listener() {}

  manuallyRemovedTarget.addEventListener("test", listener, { signal: controller.signal });
  manuallyRemovedTarget.removeEventListener("test", listener);

  onceTarget.addEventListener("test", listener, { once: true, signal: controller.signal });
  onceTarget.dispatchEvent(new window.Event("test"));

  manuallyRemovedTarget = undefined;
  onceTarget = undefined;

  let collected = false;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (manuallyRemovedTargetRef.deref() === undefined && onceTargetRef.deref() === undefined) {
      collected = true;
      break;
    }
  }

  // Keep the controller and its un-aborted signal reachable throughout the test.
  assert.equal(controller.signal.aborted, false);
  console.log(collected ? "collected" : "retained");
})();

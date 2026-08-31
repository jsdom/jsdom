"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

(async () => {
  const { window } = new JSDOM();
  const controller = new window.AbortController();
  let manuallyRemovedTarget = new window.EventTarget();
  let manuallyRemovedListener = () => {};
  let onceTarget = new window.EventTarget();
  let onceListener = () => {};
  let closedWindowListener = () => {};
  let closedDocument = window.document;
  let closedDocumentListener = () => {};

  const references = new Map([
    ["manually removed target", new WeakRef(manuallyRemovedTarget)],
    ["manually removed listener", new WeakRef(manuallyRemovedListener)],
    ["once target", new WeakRef(onceTarget)],
    ["once listener", new WeakRef(onceListener)],
    ["closed window listener", new WeakRef(closedWindowListener)],
    ["closed document listener", new WeakRef(closedDocumentListener)]
  ]);

  manuallyRemovedTarget.addEventListener("test", manuallyRemovedListener, { signal: controller.signal });
  manuallyRemovedTarget.removeEventListener("test", manuallyRemovedListener);

  onceTarget.addEventListener("test", onceListener, { once: true, signal: controller.signal });
  onceTarget.dispatchEvent(new window.Event("test"));

  window.addEventListener("test", closedWindowListener, { signal: controller.signal });
  closedDocument.addEventListener("test", closedDocumentListener, { signal: controller.signal });
  window.close();

  manuallyRemovedTarget = undefined;
  manuallyRemovedListener = undefined;
  onceTarget = undefined;
  onceListener = undefined;
  closedWindowListener = undefined;
  closedDocument = undefined;
  closedDocumentListener = undefined;

  let retained;
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    retained = [...references].filter(([, reference]) => reference.deref() !== undefined);
    if (retained.length === 0) {
      break;
    }
  }

  // Keep the controller and its un-aborted signal reachable throughout the test.
  assert.equal(controller.signal.aborted, false);
  console.log(retained.length === 0 ? "collected" : `retained: ${retained.map(([name]) => name).join(", ")}`);
})();

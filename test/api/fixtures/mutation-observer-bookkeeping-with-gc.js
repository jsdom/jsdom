"use strict";

const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const { JSDOM } = require("../../..");

function trackWeakRefs(callback) {
  const references = [];
  const OriginalWeakRef = global.WeakRef;

  // Track the bookkeeping wrappers without retaining them or their targets.
  global.WeakRef = class extends OriginalWeakRef {
    constructor(value) {
      super(value);
      references.push(new OriginalWeakRef(this));
    }
  };

  try {
    callback();
  } finally {
    global.WeakRef = OriginalWeakRef;
  }

  assert(references.length > 0);
  return references;
}

async function assertCollected(references) {
  for (let i = 0; i < 10; ++i) {
    await setImmediate();
    global.gc();
    if (references.every(reference => reference.deref() === undefined)) {
      return;
    }
  }

  assert.fail("MutationObserver retained weak-reference bookkeeping");
}

(async () => {
  const { window } = new JSDOM();
  const observer = new window.MutationObserver(() => {});
  const liveTarget = window.document.createElement("div");
  observer.observe(liveTarget, { attributes: true });

  const references = trackWeakRefs(() => {
    for (let i = 0; i < 100; ++i) {
      observer.observe(window.document.createElement("div"), { attributes: true });
    }
  });

  // Cleanup must work without further observations, notifications, or disconnects.
  await assertCollected(references);
  assert.deepEqual(observer.takeRecords(), []);

  liveTarget.setAttribute("data-test", "value");
  const records = observer.takeRecords();
  assert.equal(records.length, 1);
  assert.equal(records[0].target, liveTarget);
  observer.disconnect();

  const disconnectedReferences = trackWeakRefs(() => observer.observe(liveTarget, { attributes: true }));
  observer.disconnect();
  await assertCollected(disconnectedReferences);

  // Keep both the observer and disconnected target reachable throughout collection.
  liveTarget.setAttribute("data-test", "changed");
  assert.deepEqual(observer.takeRecords(), []);

  let discardedObserver = new window.MutationObserver(() => {});
  discardedObserver.observe(window.document.createElement("div"), { attributes: true });
  const observerRef = new WeakRef(discardedObserver);
  discardedObserver = undefined;
  await assertCollected([observerRef]);

  window.close();
  console.log("collected");
})();

"use strict";
const assert = require("node:assert/strict");
const delay = require("node:timers/promises").setTimeout;
const { VirtualConsole } = require("../../..");

function setUpLoadingAsserts(loadable) {
  loadable.loadFired = false;
  loadable.errorFired = false;
  loadable.abortFired = false;

  loadable.loadPromise = new Promise(resolve => {
    loadable.addEventListener("load", () => {
      loadable.loadFired = true;
      resolve();
    });
    loadable.addEventListener("error", () => {
      loadable.errorFired = true;
      resolve();
    });
    loadable.addEventListener("abort", () => {
      loadable.abortFired = true;
    });
  });
}

function assertNotLoaded(loadable) {
  return delay(30).then(() => {
    assert.equal(loadable.loadFired, false, "The load event must not fire");
    assert.equal(loadable.errorFired, false, "The error event must not fire");
  });
}

async function assertLoaded(loadable, virtualConsole) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, true, "The load event must fire");
  assert.equal(loadable.errorFired, false, "The error event must not fire");

  assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
}

async function assertError(loadable, virtualConsole, { isXHR = false } = {}) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, false, "The load event must not fire");
  assert.equal(loadable.errorFired, true, "The error event must fire");

  // XHR doesn't emit jsdomError events, as it's expected that XHRs often fail.
  // This is similar to how browsers have, somewhat recently, stopped showing XHR failures in the console.
  if (isXHR) {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
  } else {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 1);

    const error = virtualConsole.resourceLoadingErrors[0];
    assert(error instanceof Error);
    assert.equal(error.type, "resource-loading");
    assert.equal(error.url, loadable.src || loadable.href);
    assert(error.cause instanceof Error);
  }
}

function resourceLoadingErrorRecordingVC() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.resourceLoadingErrors = [];

  virtualConsole.forwardTo(console, { jsdomErrors: "none" });
  virtualConsole.on("jsdomError", err => {
    if (err.type === "resource-loading") {
      virtualConsole.resourceLoadingErrors.push(err);
    } else {
      // eslint-disable-next-line no-console
      console.error(err.stack);
    }
  });

  return virtualConsole;
}

module.exports = {
  setUpLoadingAsserts,
  assertNotLoaded,
  assertLoaded,
  assertError,
  resourceLoadingErrorRecordingVC
};

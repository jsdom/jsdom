"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// jsdom reads Node.js's performance clock, which web platform tests cannot control. These tests replace it with a
// fake clock so they can check how specific readings are coarsened.
const fakeClock = { now: 0 };

function withFakeNodeClock(timeOrigin, fn) {
  Object.defineProperty(performance, "timeOrigin", { value: timeOrigin, configurable: true });
  Object.defineProperty(performance, "now", { value: () => fakeClock.now, configurable: true });

  try {
    fn();
  } finally {
    delete performance.timeOrigin;
    delete performance.now;
  }
}

describe("API: performance clock coarsening", () => {
  it("should coarsen the time origin and the current time before subtracting them", () => {
    withFakeNodeClock(1_700_000_000_000, () => {
      fakeClock.now = 10.09;
      const { window } = new JSDOM();

      fakeClock.now = 10.11;
      assert.equal(window.performance.timeOrigin, 1_700_000_000_010);
      assert.equal(window.performance.now(), 0.1);
    });
  });

  it("should return 0 while the current time is within the time origin's 100 microsecond interval", () => {
    withFakeNodeClock(1_700_000_000_000, () => {
      fakeClock.now = 10.01;
      const { window } = new JSDOM();

      fakeClock.now = 10.09;
      assert.equal(window.performance.now(), 0);
    });
  });

  it("should return whole multiples of 100 microseconds without floating point error", () => {
    withFakeNodeClock(1_700_000_000_000, () => {
      fakeClock.now = 10.01;
      const { window } = new JSDOM();

      fakeClock.now = 10.71;
      assert.equal(window.performance.now(), 0.7);
    });
  });
});

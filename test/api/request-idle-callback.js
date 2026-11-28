"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");

// Lets any pending idle callbacks run, without depending on wall-clock delays: the drain timer is registered
// before this one, so it always fires first.
function nextMacrotask() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe("API: window.requestIdleCallback and window.cancelIdleCallback", () => {
  it("should exist on the window without requiring pretendToBeVisual", () => {
    const { window } = new JSDOM();

    assert.equal(typeof window.requestIdleCallback, "function");
    assert.equal(typeof window.cancelIdleCallback, "function");
  });

  it("should exist on child frame windows", () => {
    const { window } = new JSDOM(`<body></body>`);
    const frame = window.document.createElement("iframe");
    window.document.body.appendChild(frame);

    assert.equal(typeof frame.contentWindow.requestIdleCallback, "function");
    assert.equal(typeof frame.contentWindow.cancelIdleCallback, "function");
  });

  it("should invoke the callback with an IdleDeadline", () => {
    const { window } = new JSDOM();

    return new Promise((resolve, reject) => {
      window.requestIdleCallback((deadline) => {
        try {
          assert.equal(deadline.didTimeout, false);
          assert.equal(typeof deadline.timeRemaining, "function");
          assert.equal(typeof deadline.timeRemaining(), "number");

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  });

  it("should invoke the callback exactly once", async () => {
    const { window } = new JSDOM();
    let calls = 0;

    window.requestIdleCallback(() => {
      calls++;
    });

    await nextMacrotask();

    assert.equal(calls, 1);
  });

  it("should not invoke a cancelled callback", async () => {
    const { window } = new JSDOM();
    let called = false;

    const handle = window.requestIdleCallback(() => {
      called = true;
    });
    window.cancelIdleCallback(handle);

    await nextMacrotask();

    assert.equal(called, false);
  });

  it("should force invocation at the timeout and set didTimeout", () => {
    const { window } = new JSDOM();

    return new Promise((resolve, reject) => {
      window.requestIdleCallback(
        (deadline) => {
          try {
            assert.equal(deadline.didTimeout, true);

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        { timeout: 0 },
      );
    });
  });

  it("should not invoke a timed-out callback twice", async () => {
    const { window } = new JSDOM();
    let calls = 0;

    window.requestIdleCallback(
      () => {
        calls++;
      },
      { timeout: 0 },
    );

    await nextMacrotask();

    assert.equal(calls, 1);
  });

  it("should not invoke callbacks after window.close()", async () => {
    const { window } = new JSDOM();
    let called = false;

    window.requestIdleCallback(() => {
      called = true;
    });
    window.close();

    await nextMacrotask();

    assert.equal(called, false);
  });

  it("should return 0 once the document is destroyed", () => {
    const { window } = new JSDOM();

    window.close();

    assert.equal(
      window.requestIdleCallback(() => {}),
      0,
    );
  });

  it("should throw a TypeError for a non-callable callback", () => {
    const { window } = new JSDOM();

    assert.throws(() => window.requestIdleCallback("not a function"), TypeError);
  });

  it("should report exceptions thrown by the callback", async () => {
    const virtualConsole = new VirtualConsole();
    const { window } = new JSDOM(``, { virtualConsole });

    const errors = [];
    virtualConsole.on("jsdomError", (error) => {
      errors.push(error);
    });

    window.requestIdleCallback(() => {
      throw new Error("boom");
    });

    await nextMacrotask();

    assert.equal(errors.length, 1);
    assert.ok(errors[0] instanceof Error);
    assert.equal(errors[0].type, "unhandled-exception");
    assert.equal(errors[0].cause.message, "boom");
  });
});

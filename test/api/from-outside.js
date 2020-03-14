"use strict";
const path = require("path");
const { spawnSync } = require("child_process");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM } = require("../..");
const { delay } = require("../util");

describe("Test cases only possible to test from the outside", () => {
  it("window.close() should prevent timers from registering and cause them to return 0", async () => {
    const { window } = new JSDOM();

    assert.notEqual(window.setTimeout(() => {}, 100), undefined);

    window.close();

    let ran = false;
    assert.equal(window.setTimeout(() => {
      ran = true;
    }), 0);

    await delay(10);

    assert.equal(ran, false);
  });

  it("window.close() should stop a setInterval()", async () => {
    const { window } = new JSDOM(`<script>
      window.counter = 0;
      setInterval(() => window.counter++, 10);
    </script>`, { runScripts: "dangerously" });

    await delay(55);
    window.close();

    // We can't assert it's equal to 5, because the event loop might have been busy and not fully executed all 5.
    assert.isAtLeast(window.counter, 1);
    const counterBeforeSecondDelay = window.counter;

    await delay(50);

    assert.equal(window.counter, counterBeforeSecondDelay);
  });

  it("frees up callback handles passed to setTimeout", { skipIfBrowser: true, timeout: 5000 }, () => {
    const timeoutWithGcFixturePath = path.resolve(__dirname, "./fixtures/timeout-with-gc.js");
    const { status, stdout } = spawnSync("node", ["--expose-gc", timeoutWithGcFixturePath], { encoding: "utf-8" });

    assert.equal(status, 0);
    const diffInBytes = Number(stdout);
    assert.isNotNaN(diffInBytes);
    const diffInMB = diffInBytes / 1024 / 1024;
    assert.isBelow(diffInMB, 5);
  });
});

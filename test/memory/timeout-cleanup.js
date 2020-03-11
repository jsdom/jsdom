"use strict";

const { spawnSync } = require("child_process");
const { describe, it } = require("mocha-sugar-free");
const { assert } = require("chai");

const timeoutWithGcFixturePath = require.resolve("./fixtures/timeout-with-gc");

describe("setTimeout memory cleanup", () => {
  it("frees up callback handles passed to setTimeout", () => {
    const { status, stdout } = spawnSync("node", ["--expose-gc", timeoutWithGcFixturePath], { encoding: "utf8" });

    assert.equal(status, 0, stdout);
    const diffInMB = Number(stdout);
    assert.isNotNaN(diffInMB, stdout);
    assert.isBelow(diffInMB, 2, stdout);
  });
});

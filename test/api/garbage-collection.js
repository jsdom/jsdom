"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { describe, it } = require("mocha-sugar-free");

function runFixture(name, ...args) {
  const fixture = path.resolve(__dirname, "fixtures", name);
  const { error, status, stderr, stdout } = spawnSync(process.execPath, ["--expose-gc", fixture, ...args], {
    encoding: "utf-8",
    timeout: 5000
  });
  assert.ifError(error);
  assert.equal(status, 0, stderr);
  return stdout.trim();
}

describe("Garbage collection", () => {
  it("frees up callback handles passed to setTimeout", { timeout: 5000 }, () => {
    const ratio = Number(runFixture("timeout-with-gc.js"));
    assert(!Number.isNaN(ratio));

    // At least 70% of the memory must be freed up.
    assert(ratio < 0.3);
  });

  it("does not retain removed stylesheets or rules when matched elements remain alive", { timeout: 5000 }, () => {
    assert.equal(runFixture("removed-stylesheet-with-gc.mjs"), "collected");
  });

  it("does not retain detached shadow trees through adopted stylesheets", { timeout: 5000 }, () => {
    assert.equal(runFixture("adopted-stylesheets-with-gc.mjs"), "collected");
  });

  // Regression test for https://github.com/jsdom/jsdom/issues/4338
  it("does not retain closed windows after computing styles", { timeout: 5000 }, () => {
    assert.equal(runFixture("computed-style-with-gc.mjs"), "collected");
  });

  for (const method of ["querySelector", "matches"]) {
    it(`does not retain parent strings through ${method} selectors`, { timeout: 5000 }, () => {
      assert.equal(runFixture("dom-selector-source-slice-with-gc.mjs", method), "collected");
    });
  }

  for (const kind of ["supports", "supports-property-name", "sheet"]) {
    it(`does not retain parent strings through CSS ${kind} input slices`, { timeout: 5000 }, () => {
      assert.equal(runFixture("public-css-source-slice-with-gc.mjs", kind), "collected");
    });
  }

  it("does not retain removed children through live collections", { timeout: 5000 }, () => {
    assert.equal(runFixture("live-collections-with-gc.js"), "collected");
  });

  it("does not retain removed subtrees after Range indexing", { timeout: 5000 }, () => {
    assert.equal(runFixture("range-indexes-with-gc.js"), "collected");
  });

  it("does not retain observed nodes or unreachable MutationObserver instances", { timeout: 5000 }, () => {
    assert.equal(runFixture("mutation-observer-with-gc.js"), "collected");
  });

  it("does not retain targets or callbacks of removed signal-bound event listeners", { timeout: 5000 }, () => {
    assert.equal(runFixture("event-listener-signal-with-gc.js"), "collected");
  });

  it("does not retain removed iframe windows", { timeout: 5000 }, () => {
    assert.equal(runFixture("removed-iframe-with-gc.js"), "collected");
  });

  for (const scenario of ["valid", "invalid", "throwing", "imported"]) {
    it(`does not retain closed windows after stylesheet parsing (${scenario})`, { timeout: 5000 }, () => {
      assert.equal(runFixture("stylesheet-parsing-with-gc.mjs", scenario), "collected");
    });
  }
});

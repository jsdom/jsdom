"use strict";

const assert = require("node:assert/strict");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const targetCount = 128;

function createSubstitutionSheet(revision) {
  return Array.from({ length: targetCount }, (_, index) => {
    return (
      `.rule-${index} { --base: value-ASCII-${revision}-${index}; --middle: var(--base); ` +
      `--value: var(--middle) var(--missing, 'fallback-${revision}-${index}'); }`
    );
  }).join("\n");
}

function createComputedFixture() {
  const { window } = new JSDOM();
  const { document } = window;
  const style = document.createElement("style");
  document.head.append(style);
  const targets = Array.from({ length: targetCount }, (_, index) => {
    const target = document.createElement("div");
    target.className = `rule-${index}`;
    document.body.append(target);
    return target;
  });
  return { window, style, targets };
}

function assertSubstitutions(window, targets, revision) {
  for (const [index, target] of targets.entries()) {
    assert.equal(
      window.getComputedStyle(target).getPropertyValue("--value"),
      `value-ASCII-${revision}-${index} 'fallback-${revision}-${index}'`,
    );
  }
}

function readSubstitutions(window, targets) {
  let length = 0;
  for (const target of targets) {
    length += window.getComputedStyle(target).getPropertyValue("--value").length;
  }
  return length;
}

module.exports = () => {
  const bench = new Bench();

  {
    let window, style, source;
    let revision = 0;
    bench.add(
      "Assign and read a new nested custom-property value",
      () => {
        source = `f([${++revision}] 'quoted' var(--missing, fallback))`;
        style.setProperty("--value", source);
        return style.getPropertyValue("--value").length;
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          style = window.document.createElement("div").style;
          source = `f([${++revision}] 'quoted' var(--missing, fallback))`;
          style.setProperty("--value", source);
          assert.equal(style.getPropertyValue("--value"), source);
        },
        afterAll() {
          assert.equal(style.getPropertyValue("--value"), source);
          window.close();
        },
      },
    );
  }

  {
    let window, style, targets;
    let revision = 0;
    // Each iteration includes input creation, stylesheet replacement and first
    // computed reads. The fixed DOM is created outside the timed workload.
    bench.add(
      "Build stylesheet and resolve custom substitutions (128 targets)",
      () => {
        style.textContent = createSubstitutionSheet(++revision);
        return readSubstitutions(window, targets);
      },
      {
        beforeAll() {
          ({ window, style, targets } = createComputedFixture());
          style.textContent = createSubstitutionSheet(++revision);
          assert.equal(style.sheet.cssRules.length, targetCount);
          assertSubstitutions(window, targets, revision);
        },
        afterAll() {
          assert.equal(style.sheet.cssRules.length, targetCount);
          assertSubstitutions(window, targets, revision);
          window.close();
        },
      },
    );
  }

  {
    let window, style, targets;
    // Setup resolves every target. Timed iterations only repeat the public
    // getter calls with the stylesheet and DOM unchanged.
    bench.add(
      "Read cached custom substitutions (128 targets)",
      () => {
        return readSubstitutions(window, targets);
      },
      {
        beforeAll() {
          ({ window, style, targets } = createComputedFixture());
          style.textContent = createSubstitutionSheet(1);
          assert.equal(style.sheet.cssRules.length, targetCount);
          assertSubstitutions(window, targets, 1);
        },
        afterAll() {
          assertSubstitutions(window, targets, 1);
          window.close();
        },
      },
    );
  }

  return bench;
};

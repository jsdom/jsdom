import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM } from "../../../lib/api.js";

const kind = process.argv[2];
assert(["supports", "supports-property-name", "sheet"].includes(kind));
const { window } = new JSDOM("<!doctype html><body></body>");
const sheets = [];
const count = 8;
const parentLength = 4 * 1024 * 1024;

function condition(index) {
  return index % 2 === 0 ? `(width: ${123456 + index}px)` : `(width: invalid-probe-token-${index})`;
}

function propertyName(index) {
  return `--cached-property-name-abcdefghijklmnop-${index}`;
}

function sheetSource(index) {
  return `.key-parent-probe-${index} { width: ${123456 + index}px; }`;
}

function populate(index, length) {
  let value;
  if (kind === "supports") {
    value = condition(index);
  } else if (kind === "supports-property-name") {
    value = propertyName(index);
  } else {
    value = sheetSource(index);
  }
  const padding = `${index}-padding-`.repeat(Math.ceil(length / 10)).slice(0, length);
  const prefix = index % 4 < 2;
  const parent = prefix ? padding + value : value + padding;
  const source = prefix ? parent.slice(length) : parent.slice(0, value.length);
  if (kind === "supports") {
    assert.equal(window.CSS.supports(source), index % 2 === 0);
  } else if (kind === "supports-property-name") {
    assert.equal(window.CSS.supports(source, "retained-value"), true);
  } else {
    const sheet = new window.CSSStyleSheet();
    sheet.replaceSync(source);
    sheets.push(sheet);
  }
}

async function collect() {
  for (let index = 0; index < 12; ++index) {
    await setImmediate();
    global.gc();
  }
  const { heapUsed, external } = process.memoryUsage();
  return heapUsed + external;
}

try {
  populate(-1, 32);
  const before = await collect();
  for (let index = 0; index < count; ++index) {
    populate(index, parentLength);
  }
  const retained = await collect() - before;
  // Reconstruct equal strings and observe rule getters only after measuring
  // retention with the document, constructed sheets and module caches alive.
  for (let index = 0; index < count; ++index) {
    if (kind === "supports") {
      assert.equal(window.CSS.supports(condition(index)), index % 2 === 0);
    } else if (kind === "supports-property-name") {
      assert.equal(window.CSS.supports(propertyName(index), "retained-value"), true);
    } else {
      const sheet = sheets[index + 1];
      assert.equal(sheet.cssRules.length, 1);
      assert.equal(sheet.cssRules[0].selectorText, `.key-parent-probe-${index}`);
      assert.equal(sheet.cssRules[0].style.width, `${123456 + index}px`);
    }
  }
  assert.equal(window.document.documentElement.isConnected, true);
  assert(retained < count * parentLength / 2, `Cached ${kind} input slices retained ${retained} bytes`);
} finally {
  window.close();
}
console.log("collected");

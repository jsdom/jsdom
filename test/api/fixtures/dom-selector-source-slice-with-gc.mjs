import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM } from "../../../lib/api.js";

const method = process.argv[2];
assert(["querySelector", "matches"].includes(method));
const { window } = new JSDOM("<!doctype html><body></body>");
const targets = [];
const count = 8;
const parentLength = 4 * 1024 * 1024;

function name(index) {
  return `query-token-abcdefghijklmnop-${index}`;
}

function selector(index) {
  return `div[data-probe="${name(index)}"]`;
}

for (let index = -1; index < count; ++index) {
  const target = window.document.createElement("div");
  target.setAttribute("data-probe", name(index));
  window.document.body.append(target);
  targets.push(target);
}

function check(source, index) {
  const target = targets[index + 1];
  if (method === "querySelector") {
    assert.equal(window.document.querySelector(source), target);
  } else {
    assert.equal(target.matches(source), true);
    assert.equal(window.document.body.matches(source), false);
  }
}

function populate(index, length) {
  const value = selector(index);
  const padding = `${index}-padding-`.repeat(Math.ceil(length / 10)).slice(0, length);
  // Alternate prefix and suffix slices without keeping either parent alive.
  if (index % 2 === 0) {
    const parent = padding + value;
    check(parent.slice(length), index);
  } else {
    const parent = value + padding;
    check(parent.slice(0, value.length), index);
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
  // Equal strings can change a runtime's backing representation. Check repeat
  // queries only after measuring retention with the document and cache alive.
  for (let index = 0; index < count; ++index) {
    check(selector(index), index);
  }
  assert.equal(window.document.documentElement.isConnected, true);
  assert(retained < count * parentLength / 2, `Cached selector input slices retained ${retained} bytes`);
} finally {
  window.close();
}
console.log("collected");

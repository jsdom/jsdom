import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM } from "../../../lib/api.js";

const { window } = new JSDOM();
const sheet = new window.CSSStyleSheet();
sheet.replaceSync("@property --color { syntax: '<color>'; inherits: false; initial-value: red; }");

function createAndRemoveHost(clearSheets) {
  const host = window.document.createElement("div");
  window.document.body.append(host);
  const root = host.attachShadow({ mode: "open" });
  root.adoptedStyleSheets = [sheet];
  if (clearSheets) {
    root.adoptedStyleSheets.length = 0;
  }
  host.remove();
  return [new WeakRef(host), new WeakRef(root)];
}

const references = [...createAndRemoveHost(false), ...createAndRemoveHost(true)];
for (let i = 0; i < 10; ++i) {
  await setImmediate();
  global.gc();
}
assert(references.every(reference => reference.deref() === undefined));
assert.equal(sheet.cssRules.length, 1);
assert.equal(window.document.body.isConnected, true);
window.close();
console.log("collected");

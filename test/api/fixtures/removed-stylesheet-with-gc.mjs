import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM } from "../../../lib/api.js";

const { window } = new JSDOM("<div></div>");
const element = window.document.querySelector("div");

function createAndRemoveStyle() {
  const style = window.document.createElement("style");
  style.textContent = "div { color: red; }";
  window.document.head.append(style);
  const references = [new WeakRef(style.sheet), new WeakRef(style.sheet.cssRules[0])];
  assert.equal(window.getComputedStyle(element).color, "rgb(255, 0, 0)");
  style.remove();
  return references;
}

function createAndDeleteRule() {
  const style = window.document.createElement("style");
  style.textContent = "div { color: blue; }";
  window.document.head.append(style);
  const reference = new WeakRef(style.sheet.cssRules[0]);
  assert.equal(window.getComputedStyle(element).color, "rgb(0, 0, 255)");
  style.sheet.deleteRule(0);
  return reference;
}

const references = [...createAndRemoveStyle(), createAndDeleteRule()];
for (let i = 0; i < 10; ++i) {
  await setImmediate();
  global.gc();
}
assert(references.every(reference => reference.deref() === undefined));
assert.equal(element.isConnected, true);
assert.equal(window.document.styleSheets.length, 1);
window.close();
console.log("collected");

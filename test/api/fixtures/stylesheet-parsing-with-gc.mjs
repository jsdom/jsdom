import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { JSDOM, VirtualConsole } from "../../../lib/api.js";

const scenario = process.argv[2];
const cssText = scenario === "valid" ? "p { color: orange; }" : "p { color: orange; } }";

async function createAndClose() {
  const virtualConsole = new VirtualConsole();
  const { window } = new JSDOM("", {
    virtualConsole,
    resources: scenario === "imported" ? "usable" : undefined
  });
  const ref = new WeakRef(window);
  const callbackError = new Error("The CSS error listener threw");
  let errorCount = 0;
  virtualConsole.on("jsdomError", error => {
    assert.equal(error.type, "css-parsing");
    assert.equal(error.sheetText, cssText);
    ++errorCount;
    if (scenario === "throwing") {
      throw callbackError;
    }
  });

  const style = window.document.createElement("style");
  style.textContent = scenario === "imported" ? `@import "data:text/css,${encodeURIComponent(cssText)}";` : cssText;
  if (scenario === "throwing") {
    assert.throws(() => window.document.head.append(style), error => error === callbackError);
  } else {
    window.document.head.append(style);
    if (scenario === "imported") {
      await new Promise(resolve => window.addEventListener("load", resolve, { once: true }));
    }
    const sheet = scenario === "imported" ? style.sheet.cssRules[0].styleSheet : style.sheet;
    assert.equal(sheet.cssRules.length, 1);
  }
  assert.equal(errorCount > 0, scenario !== "valid");

  window.close();
  return ref;
}

const windows = [];
// Repeated values hit the property cache, avoiding another parse that would clear the retained callback.
for (let i = 0; i < 10; ++i) {
  windows.push(await createAndClose());
}

for (let i = 0; i < 10; ++i) {
  await setImmediate();
  global.gc();
  if (windows.every(ref => ref.deref() === undefined)) {
    break;
  }
}

assert.deepEqual(windows.flatMap((ref, i) => ref.deref() === undefined ? [] : [i]), []);
console.log("collected");

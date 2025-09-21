"use strict";
const path = require("path");
const { spawnSync } = require("child_process");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");
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
      setInterval(() => window.counter++, 2);
    </script>`, { runScripts: "dangerously" });

    await delay(11);
    window.close();

    // We can't assert it's equal to 5, because the event loop might have been busy and not fully executed all 5.
    assert(window.counter >= 1);
    const counterBeforeSecondDelay = window.counter;

    await delay(10);

    assert.equal(window.counter, counterBeforeSecondDelay);
  });

  it("frees up callback handles passed to setTimeout", { timeout: 5000 }, () => {
    const timeoutWithGcFixturePath = path.resolve(__dirname, "./fixtures/timeout-with-gc.js");
    const { status, stdout } = spawnSync("node", ["--expose-gc", timeoutWithGcFixturePath], { encoding: "utf-8" });

    assert.equal(status, 0);
    const ratio = Number(stdout);
    assert(!Number.isNaN(ratio));

    // At least 70% of the memory must be freed up.
    assert(ratio < 0.3);
  });

  it("window.close() should work from within a load event listener", async () => {
    const errors = [];
    const virtualConsole = new VirtualConsole().forwardTo(console);
    virtualConsole.on("jsdomError", e => {
      errors.push(e);
    });

    const { window } = new JSDOM(``, { virtualConsole });
    window.addEventListener("load", () => {
      window.close();
    });
    await delay(0);

    assert.deepEqual(errors, []);
  });

  it("document.currentScript is null when not executing <script>", () => {
    const { window } = new JSDOM();
    assert.equal(window.document.currentScript, null);
  });

  it("should process data: URLs in stylesheets even with external resources disabled (GH-743)", () => {
    const html = `
      <html><head>
        <style id="test-style">
          @font-face {
            font-family: "testfont";
            src: url(data:font/opentype;base64,AAEAAAABAAgAAAE=);
          }
        </style>
      </head><body></body></html>
    `;
    const { window } = new JSDOM(html);
    const { sheet } = window.document.getElementById("test-style");

    assert.equal(sheet.cssRules.length, 1, "Should contain one CSS rule");
    const [fontFaceRule] = sheet.cssRules;
    assert.equal(fontFaceRule.type, window.CSSRule.FONT_FACE_RULE, "Rule should be a CSSFontFaceRule");
  });

  it("should switch node context on querySelector() (GH-3928)", () => {
    const html = `
      <div>
        <span id="s1">Actions</span>
        <ul>
          <li>
            <a href="/">
              <span id="s2">Link</span>
            </a>
          </li>
        </ul>
      </div>
    `;
    const { window } = new JSDOM(html);
    const { document } = window;
    const anchor = document.querySelector("a");
    const span = anchor.querySelector("span");
    assert.equal(span.innerHTML, "Link");
  });
});

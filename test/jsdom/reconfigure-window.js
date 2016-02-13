"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

describe("jsdom/reconfigure-window", () => {
  specify("Can reconfigure top", () => {
    const window = jsdom.jsdom().defaultView;

    const targetTop = { is: "top" };

    jsdom.reconfigureWindow(window, {
      top: targetTop
    });

    assert.strictEqual(window.top, targetTop, "top should be changed (from the outside)");

    window.document.body.innerHTML = `<script>
      window.topResult = top.is;
    </script>`;

    assert.strictEqual(window.topResult, "top", "top should be changed (from the inside)");
  });

  specify("Passing no top option does nothing", () => {
    const window = jsdom.jsdom().defaultView;

    jsdom.reconfigureWindow(window, { });

    assert.strictEqual(window.top, window, "top should stay the same");
  });
});

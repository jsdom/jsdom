"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("current-script", { skipIfBrowser: true }, () => {
  specify("document.currentScript is null when not executing <script>", () => {
    const { window } = new JSDOM();
    assert.strictEqual(window.document.currentScript, null);
  });

  specify("document.currentScript is currently executing <script> element", { async: true }, t => {
    const html = "<html><body>" +
                "<span id='test'>hello from html</span><script src='./files/current-script.js'></script>" +
                "</body></html>";
    const options = { url: toFileUrl(__filename), resources: "usable", runScripts: "dangerously" };

    const { document } = (new JSDOM(html, options)).window;
    document.onload = function () {
      assert.strictEqual(
        document.getElementById("test").innerHTML, "true",
        "currentScript is the currently executing script element"
      );
      assert.strictEqual(document.currentScript, null, "currentScript is still null at top-level");
      t.done();
    };
  });
});

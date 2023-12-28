"use strict";

const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("current-script", () => {
  specify("document.currentScript is currently executing <script> element", { async: true }, t => {
    const html = "<html><body>" +
                "<span id='test'>hello from html</span><script src='./files/current-script.js'></script>" +
                "</body></html>";
    const options = { url: toFileUrl(__filename), resources: "usable", runScripts: "dangerously" };

    const { document } = (new JSDOM(html, options)).window;
    document.onload = function () {
      assert.equal(
        document.getElementById("test").innerHTML,
        "true",
        "currentScript is the currently executing script element"
      );
      assert.equal(document.currentScript, null, "currentScript is still null at top-level");
      t.done();
    };
  });
});

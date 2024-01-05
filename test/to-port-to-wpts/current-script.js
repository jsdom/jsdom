"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("current-script", () => {
  test("document.currentScript is currently executing <script> element", (t, done) => {
    const html = "<html><body>" +
                "<span id='test'>hello from html</span><script src='./files/current-script.js'></script>" +
                "</body></html>";
    const options = { url: toFileUrl(__filename), resources: "usable", runScripts: "dangerously" };

    const { document } = (new JSDOM(html, options)).window;
    document.onload = () => {
      assert.equal(
        document.getElementById("test").innerHTML,
        "true",
        "currentScript is the currently executing script element"
      );
      assert.equal(document.currentScript, null, "currentScript is still null at top-level");
      done();
    };
  });
});

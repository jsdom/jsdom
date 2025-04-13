"use strict";
const path = require("path");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { pathToFileURL } = require("url");
const { JSDOM } = require("../..");
const { createCSSErrorDetectingVirtualConsole } = require("../util.js");

describe("API: disableCSS constructor option", () => {
  it("should make getComputedStyle() return the empty string", () => {
    const { window } = new JSDOM(`
      <style>p { color: red; }</style>
      <p style="background-color: blue;">Hello world</p>
    `, { disableCSS: true });

    assert.equal(window.getComputedStyle(window.document.body).marginTop, "");

    const p = window.document.querySelector("p");
    assert.equal(window.getComputedStyle(p).color, "");
    assert.equal(window.getComputedStyle(p).backgroundColor, "");
  });

  it("should make HTMLStyleElement's sheet return null", () => {
    const { window } = new JSDOM(`
      <style>p { color: red; }</style>
      <p>Hello world</p>
    `, { disableCSS: true });

    const styleElement = window.document.querySelector("style");
    assert.equal(styleElement.sheet, null);
  });

  it(`should not bother to synchronize .style and style=""`, () => {
    const { window } = new JSDOM(`<p style="color: red;">Hello world</p>`, { disableCSS: true });

    const p = window.document.querySelector("p");
    assert.equal(p.style.color, "");

    window.document.body.style.color = "green";
    assert.equal(window.document.body.getAttribute("style"), null);

    p.style.color = "blue";
    assert.equal(p.getAttribute("style"), "color: red;");

    // But the CSSStyleDeclaration state is updated.
    assert.equal(p.style.color, "blue");
  });

  it("should not give a jsdomError on the virtual console for invalid CSS in <style>", () => {
    const virtualConsole = createCSSErrorDetectingVirtualConsole();

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head>
          <style>
            @invalid { this is not valid css }}
            body { color: red; unclosed property
            div ::: { margin: 10px;
          </style>
        </head>
      </html>
    `, { virtualConsole, disableCSS: true });

    assert.equal(virtualConsole.cssParsingErrorOccurred, false);
  });

  it("should not give a jsdomError on the virtual console for invalid CSS in <link>", async () => {
    const virtualConsole = createCSSErrorDetectingVirtualConsole();

    const url = pathToFileURL(path.resolve(__dirname, "fixtures/resources/index.html"));
    const options = {
      resources: "usable",
      virtualConsole,
      disableCSS: true,
      url
    };

    const dom = new JSDOM(
      `<link rel="stylesheet" href="invalid-css.css">`,
      options
    );

    await new Promise(resolve => {
      dom.window.addEventListener("load", resolve);
    });

    assert.equal(virtualConsole.cssParsingErrorOccurred, false);
  });
});

"use strict";
const path = require("path");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");

describe("CSS parsing errors", () => {
  it("should detect invalid CSS", () => {
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
    `, { virtualConsole });

    assert.equal(virtualConsole.cssParsingErrorOccurred, true);
  });

  it("should handle @container queries without errors (GH-3597)", () => {
    const virtualConsole = createCSSErrorDetectingVirtualConsole();

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head>
          <style>
            @container (min-width: 700px) {
              .card h2 {
                font-size: 2em;
              }
            }
          </style>
        </head>
      </html>
    `, { virtualConsole });

    assert.equal(virtualConsole.cssParsingErrorOccurred, false);
  });

  it("should handle @layer without errors (GH-3597)", () => {
    const virtualConsole = createCSSErrorDetectingVirtualConsole();

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head>
          <style>
            @layer {
              .card h2 {
                font-size: 2em;
              }
            }
          </style>
        </head>
      </html>
    `, { virtualConsole });

    assert.equal(virtualConsole.cssParsingErrorOccurred, false);
  });

  it("should not have any errors on sweetalert2.css (GH-2177)", async () => {
    const virtualConsole = createCSSErrorDetectingVirtualConsole();

    const resourcesPath = path.resolve(__dirname, "fixtures/resources");
    const options = {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole,
      url: `file://${resourcesPath}/`
    };

    const dom = new JSDOM(`
      <html>
        <head>
          <link href="sweetalert2.css" rel="stylesheet" type="text/css" media="all">
        </head>
      </html>
    `, options);

    await new Promise(resolve => {
      dom.window.addEventListener("load", resolve);
    });

    assert.equal(virtualConsole.cssParsingErrorOccurred, false);
  });
});

function createCSSErrorDetectingVirtualConsole() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.cssParsingErrorOccurred = false;

  virtualConsole.on("jsdomError", error => {
    if (error.message.includes("Could not parse CSS stylesheet")) {
      virtualConsole.cssParsingErrorOccurred = true;
    }
  });

  return virtualConsole;
}

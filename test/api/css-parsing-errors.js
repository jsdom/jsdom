"use strict";
const path = require("path");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");

describe("CSS parsing errors", () => {
  it("should detect invalid CSS", () => {
    const virtualConsole = cssParsingErrorRecordingVC();

    const sheetText = `
      @invalid { this is not valid css }}
      body { color: red; unclosed property
      div ::: { margin: 10px;
    `;

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head>
          <style>${sheetText}</style>
        </head>
      </html>
    `, { virtualConsole });

    assert.equal(virtualConsole.cssParsingErrors.length, 3);

    const error = virtualConsole.cssParsingErrors[0];
    assert(error instanceof Error);
    assert.equal(error.type, "css-parsing");
    assert.equal(error.sheetText, sheetText);
    assert.equal(error.cause.constructor, Error);
  });

  it("should handle spaces in font-family names without errors (GH-2123)", () => {
    const virtualConsole = cssParsingErrorRecordingVC();

    // eslint-disable-next-line no-new
    new JSDOM(`
      <html>
        <head></head>
        <body>
          <style>
          .cool-class {
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
          </style>
          <p class="cool-class">
          Hello!
          </p>
        </body>
      </html>
      `, { virtualConsole });

    assert.equal(virtualConsole.cssParsingErrors.length, 0);
  });

  it("should handle @container queries without errors (GH-3597)", () => {
    const virtualConsole = cssParsingErrorRecordingVC();

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

    assert.equal(virtualConsole.cssParsingErrors.length, 0);
  });

  it("should handle @layer without errors (GH-3597)", () => {
    const virtualConsole = cssParsingErrorRecordingVC();

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

    assert.equal(virtualConsole.cssParsingErrors.length, 0);
  });

  it("should not have any errors on sweetalert2.css (GH-2177)", async () => {
    const virtualConsole = cssParsingErrorRecordingVC();

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

    assert.equal(virtualConsole.cssParsingErrors.length, 0);
  });
});

function cssParsingErrorRecordingVC() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.cssParsingErrors = [];

  virtualConsole.forwardTo(console, { jsdomErrors: "none" });
  virtualConsole.on("jsdomError", error => {
    if (error.type === "css-parsing") {
      virtualConsole.cssParsingErrors.push(error);
    } else {
      // eslint-disable-next-line no-console
      console.error(error.stack);
    }
  });

  return virtualConsole;
}

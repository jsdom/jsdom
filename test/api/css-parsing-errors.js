"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
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

    assert.equal(virtualConsole.cssParsingErrors.length, 2);

    const error = virtualConsole.cssParsingErrors[0];
    assert(error instanceof Error);
    assert.equal(error.type, "css-parsing");
    assert.equal(error.sheetText, sheetText);
    assert.equal(error.cause.constructor, SyntaxError);
  });

  for (const [description, css] of [
    ["nested page-margin rules (GH-1374)", "@page { @top-center { content: element(headerIdentifier); } }"],
    ["nested font feature values (GH-1374)", "@font-feature-values Font One { @styleset { nice-style: 12; } }"],
    ["a qualified rule without a selector (GH-2460)", "{ /* rule without parent */ }"],
    [
      "spaces in font-family names (GH-2123)",
      '.cool-class { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }'
    ],
    ["@container queries (GH-3597)", "@container (min-width: 700px) { .card h2 { font-size: 2em; } }"],
    ["@layer (GH-3597)", "@layer { .card h2 { font-size: 2em; } }"]
  ]) {
    for (const source of ["inline", "external"]) {
      it(`should handle ${description} in ${source} stylesheets without CSS parsing errors`, async () => {
        const virtualConsole = cssParsingErrorRecordingVC();
        const sheetText = `${css} p { color: green; }`;
        const html = source === "inline" ?
          `<style>${sheetText}</style>` :
          `<link rel="stylesheet" href="data:text/css,${encodeURIComponent(sheetText)}">`;
        const { window } = new JSDOM(html, { virtualConsole, resources: "usable" });
        await new Promise(resolve => {
          window.addEventListener("load", resolve);
        });

        assert.equal(virtualConsole.cssParsingErrors.length, 0);
        const { cssRules } = window.document.styleSheets[0];
        const lastRule = cssRules[cssRules.length - 1];
        assert.equal(lastRule.selectorText, "p");
        assert.equal(lastRule.style.color, "green");
      });
    }
  }

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

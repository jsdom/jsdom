"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../..");

describe("CSS parsing errors", () => {
  for (const [description, sheetText] of [
    ["nested rules", "a {".repeat(1600) + "}".repeat(1600)],
    ["unclosed blocks", "{".repeat(20000)],
    ["selector functions", ":not(".repeat(1600) + "a" + ")".repeat(1600) + " { color: red; }"],
    ["value functions", "a { --value: " + "f(".repeat(1600) + "x" + ")".repeat(1600) + "; }"]
  ]) {
    for (const insertion of ["document construction", "appendChild", "innerHTML"]) {
      it(`reports excessive ${description} during ${insertion} without aborting the DOM operation`, () => {
        const virtualConsole = cssParsingErrorRecordingVC();
        const html = `<style>${sheetText}</style><p>after stylesheet</p>`;
        const { window } = new JSDOM(insertion === "document construction" ? html : "", { virtualConsole });
        try {
          if (insertion === "appendChild") {
            const style = window.document.createElement("style");
            style.textContent = sheetText;
            window.document.head.appendChild(style);
          } else if (insertion === "innerHTML") {
            window.document.body.innerHTML = html;
          }
          assert(virtualConsole.cssParsingErrors.length > 0);
          assert.equal(virtualConsole.cssParsingErrors[0].sheetText, sheetText);
          assert(virtualConsole.cssParsingErrors[0].cause instanceof SyntaxError);
          assert.equal(window.document.styleSheets.length, 1);
          if (insertion !== "appendChild") {
            assert.equal(window.document.querySelector("p").textContent, "after stylesheet");
          }

          window.document.querySelector("style").textContent = "p { color: green; }";
          assert.equal(window.document.styleSheets[0].cssRules[0].style.color, "green");
        } finally {
          window.close();
        }
      });
    }
  }

  it("does not suppress errors thrown by CSS parsing error listeners", () => {
    const virtualConsole = new VirtualConsole();
    const error = new Error("error listener failed");
    virtualConsole.on("jsdomError", () => {
      throw error;
    });
    assert.throws(() => new JSDOM(`<style>${"{".repeat(20000)}</style>`, { virtualConsole }), cause => cause === error);
  });

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

  it("reports fresh errors when cached stylesheet syntax is reused", () => {
    const firstConsole = cssParsingErrorRecordingVC();
    const first = new JSDOM("", { virtualConsole: firstConsole });
    const source = 'p { color: red; content: "unterminated\n }';
    const constructed = new first.window.CSSStyleSheet();
    constructed.replaceSync(source);
    assert.equal(firstConsole.cssParsingErrors.length, 0);

    const style = first.window.document.createElement("style");
    style.textContent = source;
    first.window.document.head.append(style);
    const firstError = firstConsole.cssParsingErrors[0];
    assert.equal(firstConsole.cssParsingErrors.length, 1);
    assert.equal(firstError.sheetText, source);

    const secondConsole = cssParsingErrorRecordingVC();
    const second = new JSDOM(`<style>${source}</style>`, { virtualConsole: secondConsole });
    const secondError = secondConsole.cssParsingErrors[0];
    assert.equal(secondConsole.cssParsingErrors.length, 1);
    assert.equal(secondError.sheetText, source);
    assert.notEqual(secondError, firstError);
    assert.notEqual(secondError.cause, firstError.cause);
    assert.equal(firstConsole.cssParsingErrors.length, 1);
    first.window.close();
    second.window.close();
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
